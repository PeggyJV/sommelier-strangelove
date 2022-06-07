import {
  HStack,
  ModalProps,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  Spinner,
  Flex,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { ModalInput } from "components/_inputs/ModalInput"
import { ModalMenu } from "components/_menus/ModalMenu"
import { Token as TokenType } from "data/tokenConfig"
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
import { toEther } from "utils/formatCurrency"
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
  } = useForm<FormValues>()
  const provider = useProvider()
  const p = new ethers.providers.Web3Provider(
    (window as any)?.ethereum
  )
  const router = new AlphaRouter({
    chainId: 1,
    provider: provider as unknown as AlphaRouterParams["provider"],
  })

  const watchDepositAmount = watch("depositAmount")
  const isError = errors.depositAmount !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError
  const setMax = () =>
    setValue(
      "depositAmount",
      parseFloat(
        toEther(
          selectedTokenBalance?.data?.value,
          selectedTokenBalance?.data?.decimals,
          false
        )
      )
    )
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
                href={`https://etherscan.io/tx/${depositResult?.data?.transactionHash}`}
              >
                View on Etherscan
              </Link>
            </>
          ),
          status: "success",
          closeHandler: closeAll,
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

  return (
    <BaseModal heading="Deposit" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <HStack spacing={6}>
          <VStack align="flex-start">
            <CardHeading>cellar</CardHeading>
            <Text as="span">aave2-CLR-S</Text>
          </VStack>
          <VStack align="flex-start">
            <CardHeading>maximum deposit</CardHeading>
            <Text as="span">
              {userData?.loading ? (
                <Spinner size="xs" />
              ) : (
                toEther(userData?.maxDeposit, 6)
              )}
            </Text>
          </VStack>
          <VStack align="flex-start">
            <CardHeading>deposit clears in</CardHeading>
            <Text as="span">6d 4h 23m</Text>
          </VStack>
        </HStack>
        <Flex justifyContent={"space-between"}>
          <VStack align="flex-start">
            <CardHeading>available</CardHeading>
            <Text as="span">
              {userData?.loading ? (
                <Spinner size="xs" />
              ) : (
                toEther(
                  selectedTokenBalance?.data?.value,
                  selectedTokenBalance?.data?.decimals
                )
              )}{" "}
              {selectedTokenBalance?.data?.symbol}
            </Text>
          </VStack>
          <VStack align="flex-start">
            <CardHeading>Active Asset</CardHeading>
            <Text as="span">
              {userData?.loading ? (
                <Spinner size="xs" />
              ) : (
                toEther(
                  userData?.balances?.aAsset?.value,
                  userData?.balances?.aAsset?.decimals
                )
              )}{" "}
              {userData?.balances?.aAsset?.symbol}
            </Text>
          </VStack>
        </Flex>
      </VStack>
      {/* <DepositForm /> */}
      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing={8}
          align="stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <FormControl isInvalid={isError as boolean | undefined}>
            <InputGroup display="flex" alignItems="center">
              <ModalInput
                type="number"
                step="any"
                {...register("depositAmount", {
                  required: "Enter amount",
                  valueAsNumber: true,
                  validate: {
                    positive: (v) =>
                      v > 0 || "You must submit a positive amount.",
                    // lessThanBalance: (v) => {
                    //   return (
                    //     v <
                    //       parseFloat(
                    //         toEther(userData?.balances?.dai || "")
                    //       ) || "Insufficient balance"
                    //   )
                    // },
                  },
                })}
              />
              <InputRightElement h="100%" mr={3}>
                <SecondaryButton
                  size="sm"
                  borderRadius={8}
                  onClick={setMax}
                >
                  Max
                </SecondaryButton>
              </InputRightElement>
            </InputGroup>
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

          <FormControl>
            <ModalMenu setSelectedToken={setSelectedToken} />
          </FormControl>
          <BaseButton
            type="submit"
            isDisabled={isDisabled}
            isLoading={isSubmitting}
            fontSize={21}
            py={6}
            px={12}
          >
            Deposit Liquidity
          </BaseButton>
        </VStack>
      </FormProvider>
    </BaseModal>
  )
}
