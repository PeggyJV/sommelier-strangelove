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
} from "@uniswap/smart-order-router"
import {
  Token,
  CurrencyAmount,
  Currency,
  TradeType,
  Percent,
  BigintIsh,
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

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
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
  const p = new ethers.providers.Web3Provider(
    (window as any)?.ethereum
  )
  const router = new AlphaRouter({
    chainId: 1,
    provider: provider as unknown as AlphaRouterParams["provider"],
  })

  const watchDepositAmount = watch("depositAmount")
  console.log({ watchDepositAmount })
  const isError = errors.depositAmount !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError
  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)

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

  // defaulting to using ENS address, this sholdn't be necessary once we upgrade wagmi which has the prop as not required
  const erc20Contract = useContract({
    addressOrName:
      selectedToken?.address ||
      "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

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
      JSBI.BigInt(amtInWei) as unknown as BigintIsh
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

    const route = await router.route(
      inputAmt,
      outputToken as Currency,
      TradeType.EXACT_INPUT,
      {
        recipient: account?.address as string,
        slippageTolerance: new Percent(5, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      }
    )

    return route
  }

  const onSubmit = async (data: any, e: any) => {
    // const route = await getSwapRoute()

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
        result?.data?.transactionHash &&
          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })

        result?.error &&
          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
      } catch (e) {
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
          [inputToken, outputToken],
          amtInWei,
          0,
          account?.address,
          account?.address,
          { gasLimit: "1000000" }
        )

      addToast({
        heading: "Aave V2 Cellar Deposit",
        status: "default",
        body: <Text>Depositing DAI</Text>,
        isLoading: true,
        closeHandler: close,
        duration: null,
      })
      const waitForDeposit = wait({
        confirmations: 1,
        hash: depositConf,
      })

      const depositResult = await waitForDeposit
      depositResult?.data?.transactionHash &&
        update({
          heading: "Aave V2 Cellar Deposit",
          body: (
            <>
              <Text>Deposit Success</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/tx/${depositResult?.data?.transactionHash}`}
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

      fetchUserData()
      depositResult?.error &&
        update({
          heading: "Aave V2 Cellar Deposit",
          body: <Text>Deposit Failed</Text>,
          status: "error",
          closeHandler: closeAll,
        })
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

  const onError = (errors: any, e: any) => {
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
        {/* <VStack align="flex-start">
          <CardHeading>maximum deposit</CardHeading>
          <Text as="span">
            {loading ? <Spinner size="xs" /> : toEther(maxDeposit, 6)}
          </Text>
        </VStack> */}
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
              setSelectedToken={setSelectedToken}
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
