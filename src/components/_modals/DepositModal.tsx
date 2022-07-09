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
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { ModalMenu } from "components/_menus/ModalMenu"
import { Token as TokenType, tokenConfig } from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  erc20ABI,
  useSigner,
  useContract,
  useAccount,
  useBalance,
  useProvider,
  useWaitForTransaction,
} from "wagmi"
import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
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
  selectedToken: TokenType
}
import { CardHeading } from "components/_typography/CardHeading"
import { BaseModal } from "./BaseModal"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { useGetCellarQuery } from "generated/subgraph"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  const { query } = useRouter()
  const { id } = query
  const [{ data }, refetch] = useGetCellarQuery({
    variables: {
      cellarAddress: id as string,
      cellarString: id as string,
    },
    pause: typeof id === "undefined",
  })
  const methods = useForm<FormValues>()
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
  const isError = errors.depositAmount !== undefined
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
  const { cellarRouterSigner, cellarData, userData, fetchUserData } =
    useAaveV2Cellar()

  // eslint-disable-next-line no-unused-vars
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const [selectedTokenBalance, getSelectedTokenBalance] = useBalance({
    addressOrName: account?.address,
    token: selectedToken?.address,
    formatUnits: "wei",
  })

  // defaulting to using active asset address, this sholdn't be necessary once we upgrade wagmi which has the prop as not required
  // const erc20Contract = useContract({
  //   addressOrName:
  //     selectedToken?.address ||
  //     "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  //   contractInterface: erc20ABI,
  //   signerOrProvider: signer,
  // })

  const erc20Contract =
    selectedToken?.address &&
    new ethers.Contract(selectedToken?.address, erc20ABI, signer)

  const getSwapRoute = async () => {
    const inputToken =
      selectedToken?.address &&
      new Token(
        1, // chainId
        selectedToken?.address,
        selectedTokenBalance?.data?.decimals || 18,
        selectedToken?.symbol,
        selectedToken?.symbol
      )

    const amtInBigNumber = new BigNumber(watchDepositAmount)
    const amtInWei = ethers.utils
      .parseUnits(
        amtInBigNumber.toFixed(),
        selectedTokenBalance?.data?.decimals
      )
      .toString()

    const inputAmt = CurrencyAmount.fromRawAmount(
      inputToken as Currency,
      JSBI.BigInt(amtInWei)
    )

    const outputToken =
      cellarData?.activeAsset &&
      new Token(
        1, // chainId
        cellarData?.activeAsset,
        userData?.balances?.aAsset?.decimals,
        userData?.balances?.aAsset?.symbol,
        userData?.balances?.aAsset?.symbol
      )

    const swapRoute = await router.route(
      inputAmt,
      outputToken as Currency,
      TradeType.EXACT_INPUT,
      {
        recipient: account?.address as string,
        slippageTolerance: new Percent(config.SWAP.SLIPPAGE, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      }
    )

    // if (swapRoute && swapRoute?.route[0].tokenPath.length) return []
    const tokenPath = swapRoute?.route[0].tokenPath.map(
      (token) => token?.address
    )

    const v3Route = swapRoute?.route[0]?.route as V3Route
    const fee = v3Route?.pools[0]?.fee
    const poolFees =
      swapRoute?.route[0]?.protocol === "V3" ? [fee] : []

    return { route: swapRoute, tokenPath, poolFees }
  }

  const onSubmit = async (data: any, e: any) => {
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    if (!erc20Contract) return

    analytics.track("deposit.started", {
      stable: tokenSymbol,
      value: depositAmount,
    })
    const swapRoute = await getSwapRoute()

    if (!swapRoute?.route) {
      console.warn("Failed Uniswap Swap data")
      addToast({
        heading: "Aave V2 Cellar Deposit",
        body: <Text>Unable to fetch swap data</Text>,
        status: "warning",
        closeHandler: closeAll,
      })
      return
    }

    const minAmountOut = swapRoute.route.quote
      .subtract(
        swapRoute.route.quote
          .multiply(config.SWAP.SLIPPAGE)
          .divide(100)
      )
      .toExact()
    const minAmountOutInBigNumber = new BigNumber(minAmountOut)
    const minAmountOutInWei = ethers.utils.parseUnits(
      minAmountOutInBigNumber.toFixed(),
      userData?.balances?.aAsset?.decimals
    )

    // check if approval exists
    const allowance = await erc20Contract.allowance(
      account?.address,
      config.CONTRACT.CELLAR_ROUTER.ADDRESS
    )
    const amtInBigNumber = new BigNumber(data?.depositAmount)
    const amtInWei = ethers.utils.parseUnits(
      amtInBigNumber.toFixed(),
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
          config.CONTRACT.CELLAR_ROUTER.ADDRESS,
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

    try {
      const inputToken = selectedToken?.address
      const outputToken = cellarData?.activeAsset
      const { hash: depositConf } =
        await cellarRouterSigner.depositAndSwapIntoCellar(
          config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
          // [inputToken, outputToken],
          swapRoute.tokenPath,
          swapRoute.poolFees,
          amtInWei,
          minAmountOutInWei,
          account?.address
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
            <CardHeading pb={2}>enter amount</CardHeading>
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
              />{" "}
              {errors.depositAmount?.message}
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
