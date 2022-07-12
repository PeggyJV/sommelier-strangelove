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
} from "@chakra-ui/react"
import { useEffect, useState, VFC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"
import { ModalMenu } from "components/_menus/ModalMenu"
import { Token as TokenType, tokenConfig } from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  erc20ABI,
  useSigner,
  useAccount,
  useBalance,
  useProvider,
  useWaitForTransaction,
} from "wagmi"
import { ethers } from "ethers"
import { useBrandedToast } from "hooks/chakra"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import {
  AlphaRouter,
  AlphaRouterParams,
  V3Route,
} from "@uniswap/smart-order-router"
import {
  Token,
  CurrencyAmount,
  Currency,
  TradeType,
  Percent,
} from "@uniswap/sdk-core"
import JSBI from "jsbi"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { CardHeading } from "components/_typography/CardHeading"
import { BaseModal } from "./BaseModal"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { useGetCellarQuery } from "generated/subgraph"
import { SwapSettingsCard } from "components/_cards/SwapSettingsCard"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  const [showSwapSettings, setShowSwapSettings] = useState(false)
  const { query } = useRouter()
  const { id } = query
  const [{ data }, refetch] = useGetCellarQuery({
    variables: {
      cellarAddress: id as string,
      cellarString: id as string,
    },
    pause: typeof id === "undefined",
  })
  const methods = useForm<FormValues>({
    defaultValues: { slippage: config.SWAP.SLIPPAGE },
  })
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = methods
  const provider = useProvider()
  const p =
    (window as any)?.ethereum &&
    new ethers.providers.Web3Provider((window as any)?.ethereum)
  const router = new AlphaRouter({
    chainId: 1,
    provider: provider as unknown as AlphaRouterParams["provider"],
  })

  const watchDepositAmount = watch("depositAmount")
  const isError =
    errors.depositAmount !== undefined ||
    errors.slippage !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError
  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)

  function trackedSetSelectedToken(value: TokenType | null) {
    if (value && value !== selectedToken) {
      analytics.track("deposit.stable-selected", {
        stable: value.symbol,
      })
    }

    setSelectedToken(value)
  }

  const { addToast, update, close, closeAll } = useBrandedToast()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const {
    cellarRouterSigner,
    aaveCellarSigner,
    cellarData,
    userData,
    fetchUserData,
  } = useAaveV2Cellar()

  // eslint-disable-next-line no-unused-vars
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const [selectedTokenBalance, getSelectedTokenBalance] = useBalance({
    addressOrName: account?.address,
    token: selectedToken?.address,
    formatUnits: "wei",
  })

  const erc20Contract =
    selectedToken?.address &&
    new ethers.Contract(selectedToken?.address, erc20ABI, signer)

  const getSwapRoute = async () => {
    let error = false
    let swapRoute
    try {
      const inputToken =
        selectedToken?.address &&
        new Token(
          1, // chainId
          selectedToken?.address,
          selectedTokenBalance?.data?.decimals || 18,
          selectedToken?.symbol,
          selectedToken?.symbol
        )

      const amtInWei = ethers.utils.parseUnits(
        watchDepositAmount.toString(),
        selectedTokenBalance?.data?.decimals
      )

      const inputAmt = CurrencyAmount.fromRawAmount(
        inputToken as Currency,
        JSBI.BigInt(amtInWei)
      )

      const outputToken = new Token(
        1, // chainId
        cellarData?.activeAsset,
        userData?.balances?.aAsset?.decimals,
        userData?.balances?.aAsset?.symbol,
        userData?.balances?.aAsset?.symbol
      )
      console.log({ inputToken, outputToken })

      swapRoute = await router.route(
        inputAmt,
        outputToken,
        TradeType.EXACT_INPUT,
        {
          recipient: account?.address as string,
          slippageTolerance: new Percent(
            // this is done because value must be an integer (eg. 0.5 -> 50)
            config.SWAP.SLIPPAGE * 100,
            100_00
          ),
          deadline: Math.floor(Date.now() / 1000 + 1800),
        }
      )
    } catch (e) {
      console.warn("Error Occured ", e)
      error = true
    }

    const tokenPath = swapRoute?.route[0].tokenPath.map(
      (token) => token?.address
    )

    const v3Route = swapRoute?.route[0]?.route as V3Route
    const fee = v3Route?.pools[0]?.fee
    const poolFees =
      swapRoute?.route[0]?.protocol === "V3" ? [fee] : []

    return { route: swapRoute, tokenPath, poolFees, error }
  }

  const onSubmit = async (data: any, e: any) => {
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    // if swap slippage is not set, use default value
    const slippage = data?.slippage

    if (!erc20Contract) return

    analytics.track("deposit.started", {
      stable: tokenSymbol,
      value: depositAmount,
    })

    const isActiveAsset =
      selectedToken?.address?.toLowerCase() ===
      cellarData?.activeAsset?.toLowerCase()

    // check if approval exists
    const allowance = await erc20Contract.allowance(
      account?.address,
      isActiveAsset
        ? config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS
        : config.CONTRACT.CELLAR_ROUTER.ADDRESS
    )

    const amtInWei = ethers.utils.parseUnits(
      depositAmount.toString(),
      selectedTokenBalance?.data?.decimals
    )

    let needsApproval
    try {
      needsApproval = allowance.lt(amtInWei)
    } catch (e) {
      console.error("Invalid Input")
      return
    }

    if (needsApproval) {
      analytics.track("deposit.approval-required", {
        stable: tokenSymbol,
        value: depositAmount,
      })

      try {
        const { hash } = await erc20Contract.approve(
          isActiveAsset
            ? config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS
            : config.CONTRACT.CELLAR_ROUTER.ADDRESS,
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
          analytics.track("deposit.approval-granted", {
            stable: tokenSymbol,
            value: depositAmount,
          })

          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })
        } else if (result?.error) {
          analytics.track("deposit.approval-failed", {
            stable: tokenSymbol,
            value: depositAmount,
          })

          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }
      } catch (e) {
        analytics.track("deposit.approval-cancelled", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    }

    // deposit
    let depositConf
    let depositParams

    if (isActiveAsset) {
      depositParams = [amtInWei, account?.address]
    } else {
      const swapRoute = await getSwapRoute()

      if (!swapRoute?.route || swapRoute?.error) {
        addToast({
          heading: "Aave V2 Cellar Deposit",
          body: <Text>Failed to fetch Swap Data</Text>,
          status: "error",
          closeHandler: closeAll,
        })
        return
      }

      const minAmountOut = swapRoute.route.quote
        .multiply(
          // must multiply slippage by 100 because value must be an integer (eg. 0.5 -> 50)
          100_00 - slippage * 100
        )
        .divide(100_00)
      const minAmountOutInWei = ethers.utils.parseUnits(
        minAmountOut.toExact(),
        userData?.balances?.aAsset?.decimals
      )

      depositParams = [
        config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
        swapRoute.tokenPath,
        swapRoute.poolFees,
        amtInWei,
        minAmountOutInWei,
        account?.address,
      ]
    }

    try {
      const inputToken = selectedToken?.address
      const outputToken = cellarData?.activeAsset

      // If selected token is cellar's current asset, it is cheapter to deposit into the cellar
      // directly rather than through the router. Should only use router when swapping into the
      // cellar's current asset.
      const { hash: depositConf } = isActiveAsset
        ? await aaveCellarSigner.deposit(...depositParams)
        : await cellarRouterSigner.depositAndSwapIntoCellar(
            ...depositParams
          )

      addToast({
        heading: "Aave V2 Cellar Deposit",
        status: "default",
        body: <Text>Depositing {selectedToken?.symbol}</Text>,
        isLoading: true,
        closeHandler: close,
        duration: null,
      })
      const waitForDeposit = wait({
        confirmations: 1,
        hash: depositConf,
      })

      const depositResult = await waitForDeposit
      if (depositResult?.data?.transactionHash) {
        analytics.track("deposit.succeeded", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        refetch()
        props.onClose()

        update({
          heading: "Aave V2 Cellar Deposit",
          body: (
            <>
              <Text>Deposit Success</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/tx/${depositResult?.data?.transactionHash}`}
                isExternal
              >
                <Text as="span">View on Etherscan</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
            </>
          ),
          status: "success",
          closeHandler: closeAll,
          duration: null, // toast won't close until user presses close button
        })
      }

      fetchUserData()

      if (depositResult?.error) {
        analytics.track("deposit.failed", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        update({
          heading: "Aave V2 Cellar Deposit",
          body: <Text>Deposit Failed</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    } catch (e) {
      addToast({
        heading: "Aave V2 Cellar Deposit",
        body: <Text>Deposit Cancelled</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      console.warn("failed to deposit", e)
    }
  }

  const onError = async (errors: any, e: any) => {
    // try and handle basic cases
    // gasFailure
    // onChain assert
    addToast({
      heading: "Aave V2 Cellar Deposit",
      body: <Text>Deposit Failed</Text>,
      status: "error",
      closeHandler: closeAll,
    })
  }

  const { loading, maxDeposit } = userData || {}
  const { activeAsset } = cellarData || {}
  const currentAsset = getCurrentAsset(tokenConfig, activeAsset)

  // Move active asset to top of token list.
  useEffect(() => {
    if (currentAsset == undefined) return

    const indexOfActiveAsset = tokenConfig.findIndex(
      (token) => token === currentAsset
    )

    tokenConfig.splice(
      0,
      0,
      tokenConfig.splice(indexOfActiveAsset, 1)[0]
    )
  }, [activeAsset, currentAsset])

  // Close swap settings card if user changed current asset to active asset.
  useEffect(() => {
    if (selectedToken?.address === currentAsset?.address)
      setShowSwapSettings(false)
  }, [currentAsset?.address, selectedToken?.address])

  return (
    <BaseModal heading="Deposit" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="stretch">
          <CardHeading>cellar details</CardHeading>
          <HStack justify="space-between">
            <Text as="span">Cellar</Text>
            <Text as="span">aave2-CLR-S</Text>
          </HStack>
          <HStack justify="space-between">
            <Text as="span">Active token strategy</Text>
            {loading ? (
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
              {selectedToken?.address !== currentAsset?.address && (
                <IconButton
                  aria-label="swap settings"
                  colorScheme="transparent"
                  icon={<FiSettings />}
                  onClick={() => {
                    setShowSwapSettings(!showSwapSettings)
                  }}
                />
              )}

              {showSwapSettings && <SwapSettingsCard />}
            </Flex>

            <ModalMenu
              setSelectedToken={trackedSetSelectedToken}
              activeAsset={activeAsset}
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
            Deposit
          </BaseButton>
        </VStack>
      </FormProvider>
    </BaseModal>
  )
}
