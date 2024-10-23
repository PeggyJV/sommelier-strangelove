import {
  HStack,
  ModalProps,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Icon,
  Spinner,
  Avatar,
  Tooltip,
  UseDisclosureProps,
} from "@chakra-ui/react"

import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { ModalMenu } from "components/_menus/ModalMenu"
import {
  depositAssetTokenConfig,
  Token as TokenType,
  tokenConfig,
} from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  useAccount,
  useBalance,
  useBlockNumber,
  usePublicClient,
  useWalletClient,
} from "wagmi"
import { erc20Abi, getContract, parseUnits } from "viem"
import { getAddress } from "viem"

import { useBrandedToast } from "hooks/chakra"
import { insertEvent } from "utils/supabase"
import {
  InformationIcon,
  GreenCheckCircleIcon,
} from "components/_icons"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { CardHeading } from "components/_typography/CardHeading"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { waitTime } from "data/uiConfig"
import { useGeo } from "context/geoContext"
import { useImportToken } from "hooks/web3/useImportToken"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { CellarNameKey } from "data/types"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { FaExternalLinkAlt } from "react-icons/fa"
import {
  useEnsoRoutes,
  EnsoRouteConfig,
} from "data/hooks/useEnsoRoutes"
import { config as contractConfig } from "src/utils/config"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { useQueryClient } from "@tanstack/react-query"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal?: UseDisclosureProps
}

function scientificToDecimalString(num: number) {
  // If the number is in scientific notation, split it into base and exponent
  const sign = Math.sign(num)
  let [base, exponent] = num
    .toString()
    .split("e")
    .map((item) => parseInt(item, 10))

  // Adjust for negative exponent
  if (exponent < 0) {
    let decimalString = Math.abs(base).toString()
    let padding = Math.abs(exponent) - 1
    return (
      (sign < 0 ? "-" : "") +
      "0." +
      "0".repeat(padding) +
      decimalString
    )
  }

  // Handle positive exponent or non-scientific numbers (which won't be split)
  return num.toString()
}

//! This handles all deposits, not just the tab
export const SommelierTab = ({
  notifyModal,
  ...props
}: DepositModalProps) => {
  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const cellarName = cellarData.name
  const cellarAddress = cellarConfig.id
  const [slippageValue, setSlippageValue] = useState("3")

  // TODO: Clean and enable below for enso
  /*
  // Drop active asset from deposit tokens to put active asset at the top of the token list
  if (cellarConfig.chain.id === chainSlugMap.ETHEREUM.id) {
    acceptedDepositTokenMap = acceptedETHDepositTokenMap
  } else if (cellarConfig.chain.id === chainSlugMap.ARBITRUM.id) {
    acceptedDepositTokenMap = acceptedARBDepositTokenMap
  } else {
    throw new Error(
      `Need to create new accepted token map for chain: ${cellarConfig.chain.id}`
    )
  }
  */

  let depositTokens: string[] = cellarData.depositTokens.list
  // Drop base asset from deposit token list
  depositTokens = depositTokens.filter(
    (token) => token !== cellarConfig.baseAsset.symbol
  )

  // Put base asset at the top of the token list
  depositTokens.unshift(cellarConfig.baseAsset.symbol)

  const { addToast, update, close, closeAll } = useBrandedToast()

  const currentStrategies =
    window.location.pathname?.split("/")[2]?.replace(/-/g, " ") ||
    id.replace(/-/g, " ") ||
    ""

  const importToken = useImportToken({
    onSuccess: (data) => {
      const tokenData = data as unknown as { symbol: string }
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{tokenData.symbol} added to metamask</Text>,
        closeHandler: close,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: close,
      })
    },
  })

  // Base Analytics data to differentiate between cellars
  const baseAnalytics = {
    cellarName,
    cellarAddress,
  }

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { address } = useAccount()
  const queryClient = useQueryClient()

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)
  const methods = useForm<FormValues>({
    defaultValues: { slippage: config.SWAP.SLIPPAGE },
  })
  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods
  const watchDepositAmount = watch("depositAmount")
  const isError =
    errors.depositAmount !== undefined ||
    errors.slippage !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError

  function trackedSetSelectedToken(value: TokenType | null) {
    if (value && value !== selectedToken) {
      // analytics.track("deposit.stable-selected", {
      //   ...baseAnalytics,
      //   stable: value.symbol,
      // })
    }
    setSelectedToken(value)
  }

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const activeAsset = strategyData?.activeAsset

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { data: selectedTokenBalance, queryKey } = useBalance({
    address: address,
    token: getAddress(
      selectedToken?.address ||
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    ), //WETH Address
    unit: "wei",
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient])

  const erc20Contract =
    selectedToken?.address &&
    publicClient &&
    getContract({
      address: getAddress(selectedToken?.address),
      abi: erc20Abi,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })

  // New enso route config
  // TODO: Actually get the enso route config for the watched values if the active asset is not the selected token
  const ensoRouteConfig: EnsoRouteConfig = useMemo(
    () => ({
      fromAddress: address!,
      tokensIn: [
        {
          address:
            selectedToken?.address ||
            strategyData?.activeAsset.address.toLowerCase() ||
            "",
          amountBaseDenom:
            watchDepositAmount * 10 ** (selectedToken?.decimals || 0),
        },
      ],
      tokenOut: cellarAddress,
      slippage: Number(slippageValue),
    }),
    [
      address,
      cellarAddress,
      selectedToken?.address,
      selectedToken?.decimals,
      strategyData?.activeAsset.address,
      watchDepositAmount,
      slippageValue,
    ]
  )

  const [lastEnsoResponse, setLastEnsoResponse] = useState<any>(null)

  const { ensoResponse, ensoError, ensoLoading } = useEnsoRoutes(
    ensoRouteConfig,
    !isSubmitting,
    lastEnsoResponse
  )
  useEffect(() => {
    if (ensoResponse) {
      setLastEnsoResponse(ensoResponse)
    }
  }, [ensoResponse])

  const ensoRouterContract =
    publicClient &&
    getContract({
      address: getAddress(
        contractConfig.CONTRACT.ENSO_ROUTER.ADDRESS
      ),
      abi: contractConfig.CONTRACT.ENSO_ROUTER.ABI,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })

  const isActiveAsset =
    selectedToken?.address?.toLowerCase() ===
    strategyData?.activeAsset?.address?.toLowerCase()

  const geo = useGeo()

  const queryDepositFeePercent = async (assetAddress: string) => {
    if (assetAddress === cellarConfig.baseAsset.address) {
      return 0
    }

    const [isSupported, holdingPosition, depositFee] =
      (await cellarSigner?.read.alternativeAssetData([
        assetAddress,
      ])) as [boolean, number, number]

    if (!isSupported) {
      throw new Error("Asset is not supported")
    }

    // 6 decimal place precision
    return depositFee / 10 ** 6
  }

  const [depositFee, setDepositFee] = useState<number>(0) // Use lowercase 'number'
  const [isDepositFeeLoading, setIsDepositFeeLoading] =
    useState<boolean>(false)

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchDepositFee = async () => {
      setIsDepositFeeLoading(true)

      if (selectedToken?.address) {
        try {
          const depositFee = await queryDepositFeePercent(
            selectedToken.address
          )
          setDepositFee(depositFee)
        } catch (error) {
          console.error("Error fetching deposit fee:", error)
          throw error
        }
      }

      setIsDepositFeeLoading(false)
    }

    // Call the async function
    fetchDepositFee()
  }, [selectedToken])

  const deposit = async (
    amtInWei: bigint,
    address?: string,
    assetAddress?: string
  ) => {
    if (
      assetAddress !== undefined &&
      assetAddress.toLowerCase() !==
        cellarConfig.baseAsset.address.toLowerCase()
    ) {
      // @ts-ignore
      return cellarSigner?.write.multiAssetDeposit(
        [assetAddress, amtInWei, address],
        { account: address }
      )
    } else {
      if (
        cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
        cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
      ) {
        const gasLimitEstimated = await estimateGasLimitWithRetry(
          cellarSigner?.estimateGas.deposit,
          cellarSigner?.simulate.deposit,
          [amtInWei, address],
          1000000,
          address
        )
        // @ts-ignore
        return cellarSigner?.write.deposit([amtInWei, address], {
          gas: gasLimitEstimated,
          account: address,
        })
      }
      // @ts-ignore
      return cellarSigner?.write.deposit([amtInWei, address], {
        account: address,
      })
    }
  }

  const onSubmit = async (data: any, e: any) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    // if swap slippage is not set, use default value
    const slippage = data?.slippage

    if (!erc20Contract) return
    insertEvent({
      event: "deposit.started",
      address: address ?? "",
      cellar: cellarConfig.cellar.address,
    })
    // analytics.track("deposit.started", {
    //   ...baseAnalytics,
    //   stable: tokenSymbol,
    //   value: depositAmount,
    // })

    // check if approval exists
    // @ts-ignore
    const allowance = await erc20Contract.read.allowance(
      [
        getAddress(address ?? ""),
        getAddress(cellarConfig.cellar.address),
      ],
      { account: address }
    )

    const amtInWei = parseUnits(
      depositAmount.toString(),
      selectedTokenBalance?.decimals ?? 0
    )

    let needsApproval
    try {
      needsApproval = allowance < amtInWei
    } catch (e) {
      const error = e as Error
      console.error("Invalid Input: ", error.message)
      return
    }

    let approval = !needsApproval
    if (needsApproval) {
      /* analytics.track("deposit.approval-required", {
        ...baseAnalytics,
       stable: tokenSymbol,
        value: depositAmount,
      })*/

      try {
        // @ts-ignore
        const hash = await erc20Contract.write.approve(
          [cellarConfig.cellar.address, amtInWei],
          { account: address }
        )
        addToast({
          heading: "ERC20 Approval",
          status: "default",
          body: <Text>Approving ERC20</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })
        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        if (result?.data?.transactionHash) {
          // analytics.track("deposit.approval-granted", {
          //   ...baseAnalytics,
          //   stable: tokenSymbol,
          //   value: depositAmount,
          // })
          approval = true

          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })
        } else if (result?.error) {
          // analytics.track("deposit.approval-failed", {
          //   ...baseAnalytics,
          //   stable: tokenSymbol,
          //   value: depositAmount,
          // })

          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }
      } catch (e) {
        const error = e as Error
        console.error(error.message)
        // analytics.track("deposit.approval-cancelled", {
        //   ...baseAnalytics,
        //   stable: tokenSymbol,
        //   value: depositAmount,
        // })

        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    }
    if (approval) {
      try {
        // If selected token is cellar's current asset, it is cheaper to deposit into the cellar
        // directly rather than through the router. Should only use router when swapping into the
        // cellar's current asset.

        const hash =
          isActiveAsset ||
          cellarData.depositTokens.list.includes(tokenSymbol)
            ? await deposit(
                amtInWei,
                address,
                data?.selectedToken?.address
              )
            : await walletClient!.sendTransaction({
                account: address,
                to: ensoRouterContract?.address,
                value: ensoResponse.tx.data,
              })

        if (!hash) throw new Error("response is undefined")
        addToast({
          heading: cellarName + " Cellar Deposit",
          status: "default",
          body: <Text>Depositing {selectedToken?.symbol}</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })
        const waitForDeposit = wait({
          confirmations: 1,
          hash: hash,
        })

        const depositResult = await waitForDeposit

        refetch()

        if (depositResult?.data?.transactionHash) {
          insertEvent({
            event: "deposit.succeeded",
            address: address ?? "",
            cellar: cellarConfig.cellar.address,
            transaction_hash: depositResult.data.transactionHash,
          })
          analytics.track("deposit.succeeded", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
            transaction_hash: depositResult.data.transactionHash,
          })

          update({
            heading: cellarName + " Cellar Deposit",
            body: (
              <>
                <Text>Deposit Success</Text>
                <Link
                  display="flex"
                  alignItems="center"
                  href={`${cellarConfig.chain.blockExplorer.url}/tx/${depositResult?.data?.transactionHash}`}
                  isExternal
                  textDecor="underline"
                >
                  <Text as="span">{`View on ${cellarConfig.chain.blockExplorer.name}`}</Text>
                  <ExternalLinkIcon ml={2} />
                </Link>
                <Text
                  onClick={() => {
                    importToken.mutate({
                      address: cellarAddress,
                      chain: cellarConfig.chain.id,
                    })
                  }}
                  textDecor="underline"
                  as="button"
                >
                  Import tokens to wallet
                </Text>
                {waitTime(cellarConfig) !== null && (
                  <Text textAlign="center">
                    Please wait {waitTime(cellarConfig)} after the
                    deposit to Withdraw or Bond
                  </Text>
                )}
              </>
            ),
            status: "success",
            closeHandler: closeAll,
            duration: null, // toast won't close until user presses close button
          })
        }

        const isPopUpEnable =
          cellarData.popUpTitle && cellarData.popUpDescription

        if (!notifyModal?.isOpen) {
          analytics.track(`${currentStrategies}-notify.modal-opened`)
        }
        if (isPopUpEnable) {
          props.onClose()
          //@ts-ignore
          notifyModal?.onOpen()
        }

        if (depositResult?.error) {
          analytics.track("deposit.failed", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
          })

          update({
            heading: cellarName + " Cellar Deposit",
            body: <Text>Deposit Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }
      } catch (e) {
        const error = e as Error
        if (error.message === "GAS_LIMIT_ERROR") {
          analytics.track("deposit.failed", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
            message: "GAS_LIMIT_ERROR",
          })
          addToast({
            heading: "Transaction not submitted",
            body: (
              <Text>
                Your transaction has failed, if it does not work after
                waiting some time and retrying please send a message
                in our{" "}
                {
                  <Link
                    href="https://discord.com/channels/814266181267619840/814279703622844426"
                    isExternal
                    textDecoration="underline"
                  >
                    Discord Support channel
                  </Link>
                }{" "}
                tagging a member of the front end team.
              </Text>
            ),
            status: "info",
            closeHandler: closeAll,
          })
        } else {
          console.error(error.message)
          analytics.track("deposit.rejected", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
          })

          addToast({
            heading: cellarName + " Deposit",
            body: <Text>Deposit Cancelled</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }

        console.warn("failed to deposit", e)
      }
    }
  }

  const onError = async (errors: any, e: any) => {
    // try and handle basic cases
    // gasFailure
    // onChain assert
    addToast({
      heading: cellarName + " Cellar Deposit",
      body: <Text>Deposit Failed</Text>,
      status: "error",
      closeHandler: closeAll,
    })
  }

  const currentAsset = getCurrentAsset(
    tokenConfig,
    cellarConfig.chain.id,
    activeAsset?.address
  )

  // Move active asset to top of token list.
  useEffect(() => {
    if (currentAsset === undefined) return

    const indexOfActiveAsset = depositAssetTokenConfig.findIndex(
      (token) => token === currentAsset
    )

    depositAssetTokenConfig.splice(
      0,
      0,
      depositAssetTokenConfig.splice(indexOfActiveAsset, 1)[0]
    )
  }, [activeAsset, currentAsset])

  const [ensoSharesOut, setEnsoSharesOut] = useState<number>(0)

  const [cellarSharePreviewRedeem, setCellarSharePreviewRedeem] =
    useState<number>(0)

  useEffect(() => {
    const fetchCellarSharePreviewRedeem = async () => {
      try {
        const previewRedeem = await fetchCellarPreviewRedeem(
          cellarData.slug,
          BigInt(10 ** cellarConfig.cellar.decimals)
        )
        setCellarSharePreviewRedeem(
          previewRedeem / 10 ** cellarConfig.cellar.decimals
        )
      } catch (error) {
        console.error(
          "Error fetching cellar share preview redeem: ",
          error
        )
      }
    }

    fetchCellarSharePreviewRedeem()
  }, [cellarConfig.cellar.address, cellarConfig.cellar.decimals])

  useEffect(() => {
    if (
      watchDepositAmount === undefined ||
      watchDepositAmount <= 0 ||
      Number.isNaN(watchDepositAmount)
    ) {
      setEnsoSharesOut(0)
    } else {
      setEnsoSharesOut(
        Number(ensoResponse?.amountOut || 0) /
          10 ** cellarConfig.cellar.decimals
      )
    }
  }, [watchDepositAmount, ensoResponse, cellarConfig])

  const [baseAssetPrice, setBaseAssetPrice] = useState<number>(0)

  useEffect(() => {
    const fetchBaseAssetPrice = async () => {
      try {
        const price = await fetchCoingeckoPrice(
          cellarConfig.baseAsset,
          "usd"
        )

        setBaseAssetPrice(Number(price || 0))
      } catch (error) {
        console.log(error)
        console.error("Error fetching base asset price: ", error)
      }
    }

    fetchBaseAssetPrice()
  }, [cellarConfig])

  const strategyMessages: Record<string, () => JSX.Element> = {
    "Real Yield ETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth arb": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />
          - 1 steth=1 weth is not hard coded in Aave on Arbitrum
          unlike Ethereum mainnet. There is a depeg risk for steth.
          <br /> - Borrow rates on Aave have been far more volatile
          than borrow rates on Ethereum on Ethereum .
          <br /> - This vault uses leverage, which means there is
          liquidation risk.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth opt": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br /> - This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth scroll": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br /> - This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "Real Yield USD": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "real yield usd arb": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Real Yield BTC": () => (
      <>
        <Link
          href={"https://app.rhino.fi/invest/YIELDBTC/supply"}
          isExternal
          role="group"
          textAlign="center"
        >
          <Text as="span">
            Buy and sell gassless on rhino.fi &nbsp;
          </Text>
          <Icon as={FaExternalLinkAlt} color="purple.base" />
        </Link>
        <br />
        <br />
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "ETH Trend Growth": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "Turbo GHO": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Turbo SWETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />
          - This vault has exposure to swETH, an LST that is not
          redeemable until Q1 2024, which makes this LST more
          susceptible to depegs than its redeemable counterparts.
          <br />
          <br />- Because withdrawals can only be facilitated based on
          the available ETH-swETH liquidity in the market, it is
          possible to receive swETH upon withdrawal even if you
          deposited ETH.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    Fraximal: () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized
          stablecoins, which can experience depeg events.
        </Text>
      </>
    ),
    "Real Yield LINK": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "ETH BTC Trend": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "ETH BTC Momentum": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "DeFi Stars": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "Real Yield ENS": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield UNI": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield SNX": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield 1Inch": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Morpho ETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage, which means there is
          liquidation risk.
        </Text>
      </>
    ),
    "Turbo SOMM": () => (
      <>
        <Text as="span" style={{ textAlign: "center" }}>
          Bridge your SOMM tokens to Ethereum via{" "}
          <Link
            href="https://app.sommelier.finance/bridge"
            isExternal
            textDecor="underline"
          >
            Somm bridge
          </Link>
        </Text>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Turbo eETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo STETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    turboSTETHstETHDeposit: () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo divETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault will take exposure to divETH, an emerging LST,
        which means that it may be more susceptible to depeg risk than
        some of its more established counterparts.
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo ETHx": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault has exposure to ETHx, an emerging LST, which
        means that it is more susceptible to depegs than its more
        established counterparts.
        <br />
        <br />- This vault may use leverge in the future, which means
        there is liquidation risk.
      </Text>
    ),
    "Turbo eETHV2": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
    "Turbo rsETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
    "Turbo ezETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
  }
  return (
    <>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="stretch">
          {/* <CardHeading>Strategy details</CardHeading> */}
          <HStack justify="space-between">
            <Text as="span">Vault</Text>
            <Text as="span">{cellarName}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text as="span">Accounting Asset</Text>
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              <HStack spacing={1}>
                <Avatar
                  boxSize={7}
                  src={currentAsset?.src}
                  name={currentAsset?.alt}
                  borderWidth={2}
                  borderColor="surface.bg"
                  bg="surface.bg"
                />
                <Text as="span">{currentAsset?.symbol}</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </VStack>
      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing={5}
          align="stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <FormControl isInvalid={isError as boolean | undefined}>
            <ModalMenu
              depositTokens={depositTokens}
              setSelectedToken={trackedSetSelectedToken}
              activeAsset={activeAsset?.address}
              selectedTokenBalance={selectedTokenBalance}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage color="energyYellow">
              <Icon
                p={0.5}
                mr={1}
                color="surface.bg"
                bg="red.base"
                borderRadius="50%"
                as={AiOutlineInfo}
              />
              {errors.depositAmount?.message ??
                errors.slippage?.message}
            </FormErrorMessage>
          </FormControl>
          {/* selectedToken?.symbol !== activeAsset?.symbol ? (
            <Tooltip
              hasArrow
              //label=""
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack pr={2} textAlign="center">
                <Text fontFamily={"inherit"}>
                  Non accounting asset deposits go through a router
                  and bundle a series of swaps and subsequent vault
                  deposit.
                </Text>
              </HStack>
            </Tooltip>
          ) : null*/}
          {selectedToken?.symbol !== activeAsset?.symbol ? (
            <>
              <CardHeading paddingTop="2em">
                Transaction details
              </CardHeading>
              {/*
          <HStack justify="space-between">
            <HStack spacing={1} align="center">
              <Tooltip
                hasArrow
                label="Percent of price slippage you are willing to accept for a trade. Higher slippage tolerance means your transaction is more likely to succeed, but you may get a worse price."
                bg="surface.bg"
                color="neutral.300"
                textAlign="center"
              >
                <HStack spacing={1} align="center">
                  <CardHeading fontSize="small">
                    Slippage Tolerance
                  </CardHeading>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
            </HStack>
            {cellarData.depositTokens.list.includes(
              selectedToken?.symbol || ""
            ) ? (
              <Tooltip
                hasArrow
                label="No slippage when depositing directly into a vault."
                bg="surface.bg"
                color="neutral.300"
                textAlign="center"
              >
                <HStack pr={2}>
                  <GreenCheckCircleIcon></GreenCheckCircleIcon>
                  <Text fontFamily={"inherit"}>None</Text>
                </HStack>
              </Tooltip>
            ) : (
              <Box maxW="200px">
                <InputGroup>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    placeholder="0"
                    width="4.5em"
                    disabled={isSubmitting ?? false}
                    value={
                      slippageValue !== undefined ? slippageValue : ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value

                      // If input is empty, set state to an empty string and return
                      if (inputValue === "") {
                        setSlippageValue("")
                        return
                      }

                      // Parse the input value to a float with 2 decimal places
                      const num = parseFloat(inputValue)

                      // If number is between 0 and 20, update the state
                      if (!isNaN(num) && num >= 0 && num <= 20) {
                        setSlippageValue(String(num))
                      } else {
                        addToast({
                          heading: "Invalid Slippage Tolerance",
                          body: (
                            <Text>
                              Slippage tolerance must be between 0 and
                              20%
                            </Text>
                          ),
                          status: "warning",
                          closeHandler: closeAll,
                        })

                        // Clamp the value to the 0-20 range
                        const clampedValue = Math.min(
                          Math.max(num, 0),
                          20
                        )
                        setSlippageValue(String(clampedValue))
                      }
                    }}
                    onBlur={(e) => {
                      const inputValue = e.target.value
                      if (
                        !inputValue ||
                        isNaN(parseFloat(inputValue))
                      ) {
                        setSlippageValue("0")
                      }
                    }}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
              </Box>
            )}
          </HStack>
                  */}
              <HStack justify="space-between">
                <HStack spacing={1} align="center">
                  <Tooltip
                    hasArrow
                    label="The percentage fee you will pay to deposit into the vault. This asset is deposited directly into the vault;
                  however, it may incur a small fee due to the
                  management of positions at the smart contract level."
                    bg="surface.bg"
                    color="neutral.300"
                    textAlign="center"
                  >
                    <HStack spacing={1} align="center">
                      <CardHeading fontSize="small">
                        Alternative Deposit Asset Fee
                      </CardHeading>
                      <InformationIcon
                        color="neutral.300"
                        boxSize={3}
                      />
                    </HStack>
                  </Tooltip>
                </HStack>
                {cellarData.depositTokens.list.includes(
                  selectedToken?.symbol || ""
                ) ? (
                  <>
                    {isDepositFeeLoading ? (
                      <Spinner size="md" paddingRight={"1em"} />
                    ) : (
                      <Tooltip
                        hasArrow
                        label={
                          depositFee === 0 ? "No deposit fee." : null
                        }
                        bg="surface.bg"
                        color="neutral.300"
                        textAlign="center"
                      >
                        <HStack pr={2}>
                          {depositFee === 0 ? (
                            <GreenCheckCircleIcon />
                          ) : null}
                          <Text fontFamily={"inherit"}>
                            {depositFee === 0
                              ? "None"
                              : `${depositFee}%`}
                          </Text>
                        </HStack>
                      </Tooltip>
                    )}
                  </>
                ) : null}
              </HStack>
              <HStack
                justifyContent={"center"}
                p={3}
                spacing={4}
                align="flex-start"
                backgroundColor="purple.dark"
                border="2px solid"
                borderRadius={16}
                borderColor="purple.base"
              >
                {selectedToken?.symbol !== activeAsset?.symbol ? (
                  <Text
                    fontFamily={"inherit"}
                    fontWeight={"bold"}
                    textAlign="center"
                  >
                    {
                      "If you deposit an asset other than the accounting asset, there is no guarantee that you will receive the same asset upon withdrawal."
                    }
                  </Text>
                ) : null}
              </HStack>
            </>
          ) : null}
          {!cellarData.depositTokens.list.includes(
            selectedToken?.symbol || ""
          ) ? (
            ensoError !== null &&
            watchDepositAmount !== 0 &&
            !isNaN(watchDepositAmount) ? (
              <Text
                pr="2"
                fontSize="lg"
                fontWeight={700}
                textAlign="center"
                width="100%"
              >
                {ensoError}
              </Text>
            ) : (
              <HStack justify="space-between" align="center">
                <HStack spacing={1} align="center">
                  <Tooltip
                    hasArrow
                    label="Amount of strategy tokens you will receive. This is an estimate and may change based on the price at the time of your transaction, and will vary according to your configured slippage tolerance."
                    bg="surface.bg"
                    color="neutral.300"
                    textAlign="center"
                  >
                    <HStack spacing={1} align="center">
                      <CardHeading fontSize="small">
                        Estimated Tokens Out
                      </CardHeading>
                      <InformationIcon
                        color="neutral.300"
                        boxSize={3}
                      />
                    </HStack>
                  </Tooltip>
                </HStack>
                {ensoLoading ? (
                  <>
                    <Spinner size="md" paddingRight={"1em"} />
                  </>
                ) : (
                  <VStack spacing={0} align="flex-end">
                    <Text
                      pr="2"
                      fontSize="lg"
                      fontWeight={700}
                      textAlign="right"
                      width="100%"
                    >
                      ≈ {ensoSharesOut.toFixed(4).toLocaleString()}
                    </Text>
                    <HStack
                      spacing={0}
                      fontSize="11px"
                      textAlign="right"
                      pr="2"
                    >
                      <Text as="span">
                        ${" "}
                        {(
                          ensoSharesOut *
                          cellarSharePreviewRedeem *
                          baseAssetPrice
                        )
                          .toFixed(2)
                          .toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>
                )}
              </HStack>
            )
          ) : (
            <></>
          )}
          <BaseButton
            type="submit"
            isDisabled={
              isDisabled ||
              (selectedToken?.symbol !== activeAsset?.symbol &&
                !cellarData.depositTokens.list.includes(
                  selectedToken?.symbol || ""
                ) &&
                (isDisabled ||
                  ensoLoading ||
                  (!ensoLoading && ensoError !== null)))
            }
            isLoading={isSubmitting}
            fontSize={21}
            py={8}
            px={12}
          >
            Submit
          </BaseButton>
          {/* <Text textAlign="center">
            Depositing active asset (
            <Avatar
              ml="-2.5px"
              boxSize={6}
              src={activeAsset?.src}
              name={activeAsset?.alt}
              borderWidth={2}
              borderColor="surface.bg"
              bg="surface.bg"
            />
            {activeAsset?.symbol}) will save gas fees
          </Text> */}
          {/*depositTokens.length > 1 && (
            <Text textAlign="center">
              <Text textAlign="center">
                Current Base asset is (
                <Avatar
                  ml="-2.5px"
                  boxSize={6}
                  src={activeAsset?.src}
                  name={activeAsset?.alt}
                  borderWidth={2}
                  borderColor="surface.bg"
                  bg="surface.bg"
                />
                {activeAsset?.symbol}).
                <br />
                <br />
              </Text>
              <Text>
                There could be high slippage when depositing non base
                assets. Please swap outside our app for better rates.
              </Text>
            </Text>
                )*/}
          {strategyMessages[currentStrategies] ? (
            strategyMessages[currentStrategies]()
          ) : (
            <></>
          )}
        </VStack>
      </FormProvider>
    </>
  )
}
