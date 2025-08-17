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

import { useEffect, useState, type JSX } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AiOutlineInfo } from "react-icons/ai"
import { ModalMenu } from "components/_menus/ModalMenu"
import {
  depositAssetTokenConfig,
  Token as TokenType,
  tokenConfig,
  getTokenConfig,
} from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { erc20Abi, getContract, parseUnits, getAddress } from "viem"

import { useBrandedToast } from "hooks/chakra"
import { insertEvent } from "utils/supabase"
import {
  InformationIcon,
  GreenCheckCircleIcon,
} from "components/_icons"
import { CardHeading } from "components/_typography/CardHeading"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useWaitForTransaction } from "data/hooks/useWaitForTransactions"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { waitTime, depositAssetDefaultValue } from "data/uiConfig"
import { useGeo } from "context/geoContext"
import { useImportToken } from "hooks/web3/useImportToken"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { FaExternalLinkAlt } from "react-icons/fa"
import { BaseButton } from "components/_buttons/BaseButton"
import { useUserBalances } from "data/hooks/useUserBalances"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal?: UseDisclosureProps
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

  const publicClient = usePublicClient()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { data: waitForTransaction } = useWaitForTransactionReceipt()

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)
  const [isDepositFeeLoading, setIsDepositFeeLoading] = useState(false)
  const [depositFee, setDepositFee] = useState(0)
  const methods = useForm<FormValues>({
    defaultValues: { slippage: config.SWAP.SLIPPAGE },
  })

  // Set default selected token when component mounts
  useEffect(() => {
    if (!selectedToken && depositTokens.length > 0) {
      const depositTokenConfig = getTokenConfig(
        depositTokens,
        cellarConfig.chain.id
      ) as TokenType[]

      // Get the default deposit asset for this cellar
      const defaultAssetSymbol =
        depositAssetDefaultValue(cellarConfig)
      const defaultToken =
        depositTokenConfig.find(
          (token) => token.symbol === defaultAssetSymbol
        ) || depositTokenConfig[0]

      setSelectedToken(defaultToken)
    }
  }, [selectedToken, depositTokens, cellarConfig])
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

  const { cellarSigner, boringVaultLens } =
    useCreateContracts(cellarConfig)

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const { userBalances } = useUserBalances()

  const selectedTokenBalance = userBalances.data?.find(
    (b) => b.symbol === selectedToken?.symbol
  )

  const erc20Contract =
    cellarConfig.baseAsset.address &&
    publicClient &&
    getContract({
      address: getAddress(cellarConfig.baseAsset.address),
      abi: erc20Abi,
      client: {
        public: publicClient,
      },
    })

  const cellarContract =
    publicClient &&
    getContract({
      address: getAddress(cellarConfig.cellar.address),
      abi: cellarConfig.cellar.abi,
      client: {
        public: publicClient,
      },
    })

  const queryDepositFeePercent = async (assetAddress: string) => {
    if (
      assetAddress === cellarConfig.baseAsset.address ||
      cellarConfig.boringVault
    ) {
      return 0
    }

    const [isSupported, _, depositFee] =
      (await cellarSigner?.read.alternativeAssetData([
        assetAddress,
      ])) ?? [false, 0, 0]

    return isSupported ? Number(depositFee) : 0
  }

  const doDepositTx = async (
    nativeDeposit: boolean,
    amtInWei: bigint,
    assetAddress: string
  ): Promise<any> => {
    let fnName: string
    let args: any[]
    let value: bigint

    if (cellarConfig.boringVault) {
      const minimumMint = await boringVaultLens?.read.previewDeposit([
        assetAddress,
        amtInWei,
        cellarConfig.cellar.address,
        cellarConfig.accountant?.address,
      ])
      fnName = "deposit"
      args = [assetAddress, amtInWei, minimumMint]
      value = nativeDeposit ? amtInWei : BigInt(0)
    } else if (
      assetAddress !== undefined &&
      assetAddress.toLowerCase() !==
        cellarConfig.baseAsset.address.toLowerCase()
    ) {
      const minimumMint = await cellarSigner?.read.previewDeposit([
        assetAddress,
        amtInWei,
      ])
      fnName = "deposit"
      args = [assetAddress, amtInWei, minimumMint]
      value = BigInt(0)
    } else {
      const minimumMint = await cellarSigner?.read.previewDeposit([
        amtInWei,
      ])
      fnName = "deposit"
      args = [amtInWei, address]
    }

    try {
      const hash = await writeContractAsync({
        address: cellarSigner?.address as `0x${string}`,
        abi: cellarSigner?.abi ?? cellarConfig.cellar.abi,
        functionName: fnName,
        args: args,
        value: value,
      })

      if (hash) {
        addToast({
          heading: "Deposit in Progress",
          body: <Text>Your deposit is being processed.</Text>,
          status: "info",
          closeHandler: close,
        })

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: hash,
        })

        if (receipt.status === "success") {
          addToast({
            heading: "Deposit Successful",
            body: (
              <Text>
                Your deposit has been completed successfully.
              </Text>
            ),
            status: "success",
            closeHandler: close,
          })
          return [receipt]
        } else {
          addToast({
            heading: "Deposit Failed",
            body: <Text>Deposit failed. Please try again.</Text>,
            status: "error",
            closeHandler: close,
          })
          throw new Error("Deposit failed")
        }
      }
    } catch (error) {
      console.error("Deposit error:", error)
      throw error
    }
  }

  const doApprovalTx = async (amtInWei: bigint): Promise<boolean> => {
    try {
      const hash = await writeContractAsync({
        address: cellarConfig.baseAsset.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [cellarConfig.cellar.address, amtInWei],
      })

      if (hash) {
        addToast({
          heading: "Approving Token",
          body: <Text>Please approve the token transfer.</Text>,
          status: "info",
          closeHandler: close,
        })

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: hash,
        })

        if (receipt.status === "success") {
          addToast({
            heading: "Token Approved",
            body: <Text>Token approval successful.</Text>,
            status: "success",
            closeHandler: close,
          })
          return true
        } else {
          addToast({
            heading: "Approval Failed",
            body: <Text>Token approval failed.</Text>,
            status: "error",
            closeHandler: close,
          })
          return false
        }
      }
      return false
    } catch (error) {
      console.error("Approval error:", error)
      addToast({
        heading: "Approval Cancelled",
        body: <Text>Token approval was cancelled.</Text>,
        status: "error",
        closeHandler: close,
      })
      return false
    }
  }

  const onSubmit = async (data: any, e: any) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    let nativeDeposit = selectedToken?.symbol === "ETH"
    if (!erc20Contract && !nativeDeposit) return
    insertEvent({
      event: "deposit.started",
      address: address ?? "",
      cellar: cellarConfig.cellar.address,
    })

    const walletCapabilities = await getCapabilities(publicClient)
    const atomicStatus =
      walletCapabilities[cellarConfig.chain.wagmiId]?.atomic?.status

    const canDoBatchCall =
      atomicStatus === "ready" || atomicStatus === "supported"

    const allowance = nativeDeposit
      ? Number.MAX_SAFE_INTEGER
      : // @ts-ignore
        await erc20Contract.read.allowance(
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

    let needsApproval = allowance < amtInWei
    let approval = !needsApproval

    if (needsApproval && !canDoBatchCall) {
      approval = await doApprovalTx(amtInWei)
    }

    if (approval || canDoBatchCall) {
      try {
        const receipts = await deposit(
          amtInWei,
          data?.selectedToken?.address,
          approval,
          canDoBatchCall
        )

        addToast({
          heading: cellarName + " Cellar Deposit",
          status: "default",
          body: <Text>Depositing {selectedToken?.symbol}</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })

        refetch()

        if (receipts?.[0]?.status === "success") {
          insertEvent({
            event: "deposit.succeeded",
            address: address ?? "",
            cellar: cellarConfig.cellar.address,
            transaction_hash: receipts![0].transactionHash,
          })
          analytics.track("deposit.succeeded", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
            transaction_hash: receipts![0].transactionHash,
          })

          update({
            heading: cellarName + " Cellar Deposit",
            body: (
              <>
                <Text>Deposit Success</Text>
                <Link
                  display="flex"
                  alignItems="center"
                  href={`${cellarConfig.chain.blockExplorer.url}/tx/${
                    receipts![0].transactionHash
                  }`}
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
    selectedToken?.address
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
  }, [selectedToken, currentAsset])

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
              setSelectedToken={setSelectedToken}
              activeAsset={selectedToken?.address}
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
          {selectedToken?.symbol !== cellarConfig.baseAsset.symbol ? (
            <>
              <CardHeading paddingTop="2em">
                Transaction details
              </CardHeading>
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
                {selectedToken?.symbol !==
                cellarConfig.baseAsset.symbol ? (
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
          <BaseButton
            type="submit"
            isDisabled={
              isDisabled ||
              (selectedToken?.symbol !==
                cellarConfig.baseAsset.symbol &&
                !cellarData.depositTokens.list.includes(
                  selectedToken?.symbol || ""
                ))
            }
            isLoading={isSubmitting}
            fontSize={21}
            py={8}
            px={12}
          >
            Submit
          </BaseButton>
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
