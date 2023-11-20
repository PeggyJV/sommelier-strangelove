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
  Flex,
  IconButton,
  UseDisclosureProps,
} from "@chakra-ui/react"
import { useEffect, useState, VFC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"
import { ModalMenu } from "components/_menus/ModalMenu"
import {
  depositAssetTokenConfig,
  Token as TokenType,
  tokenConfig,
} from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import { erc20ABI, useSigner, useAccount, useBalance } from "wagmi"
import { ethers } from "ethers"
import { getAddress } from "ethers/lib/utils.js"

import { useBrandedToast } from "hooks/chakra"
import { insertEvent } from "utils/supabase"
import { useNetwork } from "wagmi"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { CardHeading } from "components/_typography/CardHeading"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { SwapSettingsCard } from "components/_cards/SwapSettingsCard"
import { cellarDataMap } from "data/cellarDataMap"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useDepositAndSwap } from "data/hooks/useDepositAndSwap"
import { isActiveTokenStrategyEnabled, waitTime } from "data/uiConfig"
import { useGeo } from "context/geoContext"
import { useImportToken } from "hooks/web3/useImportToken"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { CellarNameKey } from "data/types"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { FaExternalLinkAlt } from "react-icons/fa"

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal?: UseDisclosureProps
}

export const SommelierTab: VFC<DepositModalProps> = ({
  notifyModal,
  ...props
}) => {
  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const cellarName = cellarData.name
  const cellarAddress = cellarConfig.id
  const depositTokens = cellarData.depositTokens.list
  const { addToast, update, close, closeAll } = useBrandedToast()
  
  const currentStrategies =
    window.location.pathname?.split("/")[2]?.replace(/-/g, " ") ||
    id.replace(/-/g, " ") ||
    ""

  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to metamask</Text>,
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

  const { data: signer } = useSigner()
  const { address } = useAccount()

  const { refetch } = useUserStrategyData(cellarConfig.cellar.address, cellarConfig.chain.id)

  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)
  const [showSwapSettings, setShowSwapSettings] = useState(false)
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
    cellarConfig.cellar.address, cellarConfig.chain.id
  )

  const activeAsset = strategyData?.activeAsset

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const { data: selectedTokenBalance } = useBalance({
    address: address,
    token: getAddress(
      selectedToken?.address ||
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    ), //WETH Address
    formatUnits: "wei",
    watch: true,
  })

  const erc20Contract =
    selectedToken?.address &&
    new ethers.Contract(selectedToken?.address, erc20ABI, signer!)

  const depositAndSwap = useDepositAndSwap(cellarConfig)

  const isActiveAsset =
    selectedToken?.address?.toLowerCase() ===
    strategyData?.activeAsset?.address?.toLowerCase()

  const geo = useGeo()

  const deposit = async (
    amtInWei: ethers.BigNumber,
    address?: string
  ) => {
    if (
      cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
      cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
    ) {
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        cellarSigner?.estimateGas.deposit,
        cellarSigner?.callStatic.deposit,
        [amtInWei, address],
        1000000,
        2000000
      )
      return cellarSigner?.deposit(amtInWei, address, {
        gasLimit: gasLimitEstimated,
      })
    }

    return cellarSigner?.deposit(amtInWei, address)
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
    const allowance = await erc20Contract.allowance(
      address,
      isActiveAsset
        ? cellarConfig.cellar.address
        : cellarConfig.cellarRouter.address
    )

    const amtInWei = ethers.utils.parseUnits(
      depositAmount.toString(),
      selectedTokenBalance?.decimals
    )

    let needsApproval
    try {
      needsApproval = allowance.lt(amtInWei)
    } catch (e) {
      const error = e as Error
      console.error("Invalid Input: ", error.message)
      return
    }

    if (needsApproval) {
      /* analytics.track("deposit.approval-required", {
        ...baseAnalytics,
       stable: tokenSymbol,
        value: depositAmount,
      })*/

      try {
        const { hash } = await erc20Contract.approve(
          isActiveAsset
            ? cellarConfig.cellar.address
            : cellarConfig.cellarRouter.address,
          ethers.constants.MaxUint256
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

    try {
      // If selected token is cellar's current asset, it is cheapter to deposit into the cellar
      // directly rather than through the router. Should only use router when swapping into the
      // cellar's current asset.
      const response = isActiveAsset
        ? await deposit(amtInWei, address)
        : await depositAndSwap.mutateAsync({
            cellarAddress: cellarConfig.cellar.address,
            depositAmount: depositAmount,
            slippage,
            activeAsset: {
              address: activeAsset?.address!,
              decimals: activeAsset?.decimals!,
              symbol: activeAsset?.symbol!,
            },
            selectedToken: {
              address: selectedToken.address,
              decimals: selectedTokenBalance?.decimals!,
              symbol: selectedToken.symbol,
            },
          })

      if (!response) throw new Error("response is undefined")
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
        hash: response.hash,
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
              <Text>
                Please wait {waitTime(cellarConfig)} after the deposit
                to Withdraw or Bond
              </Text>
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
              waiting some time and retrying please
              send a message in our{" "}
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

  // Close swap settings card if user changed current asset to active asset.
  useEffect(() => {
    if (selectedToken?.address === currentAsset?.address)
      setShowSwapSettings(false)
  }, [currentAsset?.address, selectedToken?.address])

  const strategyMessages: Record<string, () => JSX.Element> = {
    "Real Yield ETH": () => (
      <>
        <Text textAlign="center">
          You can use the following external services to acquire WETH:{" "}
          <Link href="https://wrapeth.com/" textDecor="underline">
            https://wrapeth.com/
          </Link>
        </Text>
        <Link
          href={"https://app.rhino.fi/invest/YIELDETH/supply"}
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
          All Sommelier vaults contain smart contract risk and varying
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
    "Real Yield USD": () => (
      <>
        <Link
          href={"https://app.rhino.fi/invest/YIELDUSD/supply"}
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
          All Sommelier vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
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
          All Sommelier vaults contain smart contract risk and varying
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
    "ETH Trend Growth": () => (
      <>
        <Text as="span">
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
        </Text>
      </>
    ),
    "Turbo SWETH": () => (
      <>
        <Text as="span">
          All Sommelier vaults contain smart contract risk and varying
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
        </Text>
      </>
    ),
    Fraximal: () => (
      <>
        <Text as="span">
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          All Sommelier vaults contain smart contract risk and varying
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
          {isActiveTokenStrategyEnabled(cellarConfig) && (
            <HStack justify="space-between">
              <Text as="span">Active token strategy</Text>
              {isLoading ? (
                <Spinner size="xs" />
              ) : (
                <HStack spacing={1}>
                  <Avatar
                    boxSize={6}
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
          )}
        </VStack>
      </VStack>
      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing={8}
          align="stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <FormControl isInvalid={isError as boolean | undefined}>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              position="relative" // anchors the swap settings card, which is positioned as absolute
            >
              <CardHeading pb={2}>enter amount</CardHeading>
              {!isActiveAsset && depositTokens.length > 1 && (
                <>
                  <IconButton
                    aria-label="swap settings"
                    colorScheme="transparent"
                    disabled={isActiveAsset}
                    color="neutral.300"
                    icon={<FiSettings />}
                    onClick={() => {
                      setShowSwapSettings(!showSwapSettings)
                    }}
                  />
                  {showSwapSettings && <SwapSettingsCard />}
                </>
              )}
            </Flex>

            <ModalMenu
              depositTokens={depositTokens}
              setSelectedToken={trackedSetSelectedToken}
              activeAsset={activeAsset?.address}
              selectedTokenBalance={selectedTokenBalance}
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
          <BaseButton
            type="submit"
            isDisabled={isDisabled}
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
          {depositTokens.length > 1 && (
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
          )}
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
