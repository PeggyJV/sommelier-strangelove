import { useState, VFC } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { ModalInput } from "components/_inputs/ModalInput"
import { ModalMenu } from "components/_menus/ModalMenu"
import { Token } from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  erc20ABI,
  useSigner,
  useContract,
  useAccount,
  useWaitForTransaction,
} from "wagmi"
import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
import { useBrandedToast } from "hooks/chakra"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { toEther } from "utils/formatCurrency"
interface FormValues {
  depositAmount: number
  selectedToken: Token
}

export const DepositForm: VFC = () => {
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
  // const [data, setData] = useState<any>()
  const watchDepositAmount = watch("depositAmount")
  const isError = errors.depositAmount !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError
  const setMax = () => setValue("depositAmount", 100000)
  const [selectedToken, setSelectedToken] = useState<Token | null>(
    null
  )
  const { addToast, update, close, closeAll } = useBrandedToast()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const { cellarRouterSigner, userData, fetchUserData } =
    useAaveV2Cellar()
  // eslint-disable-next-line no-unused-vars
  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const erc20Contract = useContract({
    addressOrName: config.CONTRACT.DAI.ADDRESS,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  const onSubmit = async (data: any, e: any) => {
    // check if approval exists
    const allowance = await erc20Contract.allowance(
      account?.address,
      config.CONTRACT.CELLAR_ROUTER.ADDRESS
    )
    const amtInBigNumber = new BigNumber(data?.depositAmount)
    const amtInWei = ethers.utils.parseUnits(
      amtInBigNumber.toFixed(),
      18
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
          body: <Text>Approving DAI</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })
        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        result?.data?.transactionHash &&
          update({
            heading: "ERC20 Approval",
            body: <Text>DAI Approved</Text>,
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
          status: "warning",
          closeHandler: closeAll,
        })
      }
    }

    // deposit
    let depositConf

    try {
      const { hash: depositConf } =
        await cellarRouterSigner.depositAndSwapIntoCellar(
          config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
          [
            config.CONTRACT.DAI.ADDRESS,
            config.CONTRACT.WETH.ADDRESS,
            config.CONTRACT.DEFI_PULSE.ADDRESS,
            config.CONTRACT.FEI.ADDRESS,
          ],
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
                  lessThanBalance: (v) => {
                    return (
                      v <
                        parseFloat(
                          toEther(userData?.balances?.dai || "")
                        ) || "Insufficient balance"
                    )
                  },
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
  )
}
