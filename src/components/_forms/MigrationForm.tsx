import React, { useEffect } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  VStack,
  Button,
  HStack,
  Input,
  Spinner,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import {
  useAccount,
  usePublicClient,
  useWriteContract,
} from "wagmi"
import { toEther } from "utils/formatCurrency"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import {
  erc20Abi,
  getAddress,
  getContract,
  parseUnits,
  zeroAddress,
} from "viem"

interface FormValues {
  withdrawAmount: number
}

interface MigrationFormProps {
  onClose: () => void
}

export const MigrationForm = ({ onClose }: MigrationFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { id: _id } = useDepositModalStore()

  const { addToast, close, closeAll } = useBrandedToast()
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const alphaStEth = cellarDataMap["Alpha-stETH"]
  const referredAddress = (alphaStEth.config.teller?.referred ??
    zeroAddress) as `0x${string}`

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const { cellarSigner, boringVaultLens } = useCreateContracts(
    alphaStEth.config
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

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)
  }

  useEffect(() => {
    if (watchWithdrawAmount !== null) {
      analytics.track("withdraw.amount-selected", {
        account: address,
        amount: watchWithdrawAmount,
      })
    }
  }, [watchWithdrawAmount, address])

  const geo = useGeo()
  const onSubmit = async ({ withdrawAmount }: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    if (withdrawAmount <= 0 || !erc20Contract || !cellarContract)
      return

    if (!address) {
      addToast({
        heading: "Connect Wallet",
        body: <Text>Please connect your wallet to continue.</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      return
    }

    try {
      const amtInWei = parseUnits(
        `${withdrawAmount}`,
        cellarConfig.cellar.decimals
      )
      const amountOfBaseAsset =
        (await cellarContract.read.convertToAssets([
          amtInWei,
        ])) as bigint

      // Check allowance and approve if needed
      const allowance = await erc20Contract.read.allowance([
        getAddress(address),
        getAddress(alphaStEth.config.cellar.address),
      ])

      let needsApproval = allowance < amountOfBaseAsset
      if (needsApproval) {
        const approvalHash = await writeContractAsync({
          address: cellarConfig.baseAsset.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            alphaStEth.config.cellar.address as `0x${string}`,
            amountOfBaseAsset,
          ],
        })

        if (approvalHash) {
          addToast({
            heading: "Approving Token",
            body: <Text>Please approve the token transfer.</Text>,
            status: "info",
            closeHandler: close,
          })

          await publicClient.waitForTransactionReceipt({
            hash: approvalHash,
          })
        }
      }

      // Get minimum mint amount
      const minimumMint = await boringVaultLens?.read.previewDeposit([
        cellarConfig.baseAsset.address,
        amountOfBaseAsset,
        alphaStEth.config.cellar.address,
        alphaStEth.config.accountant?.address,
      ])

      // Execute migration
      if (!cellarSigner?.abi) {
        throw new Error("Cellar signer ABI unavailable")
      }
      const migrationHash = await writeContractAsync({
        address: cellarSigner?.address as `0x${string}`,
        abi: cellarSigner.abi,
        functionName: "deposit",
        args: [
          cellarConfig.baseAsset.address,
          amountOfBaseAsset,
          minimumMint,
          referredAddress,
        ],
      })

      if (migrationHash) {
        addToast({
          heading: "Migration in Progress",
          body: <Text>Your migration is being processed.</Text>,
          status: "info",
          closeHandler: close,
        })

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: migrationHash,
        })

        if (receipt.status === "success") {
          addToast({
            heading: "Migration Successful",
            body: (
              <Text>
                Your migration has been completed successfully.
              </Text>
            ),
            status: "success",
            closeHandler: close,
          })
          refetch()
          onClose()
        } else {
          addToast({
            heading: "Migration Failed",
            body: <Text>Migration failed. Please try again.</Text>,
            status: "error",
            closeHandler: close,
          })
        }
      }
    } catch (e) {
      const error = e as Error
      const isUserRejection = error.message?.includes("User rejected")

      addToast({
        heading: "Migration",
        body: (
          <Text>
            {isUserRejection
              ? "Migration cancelled"
              : "Migration failed. Please try manual migration."}
          </Text>
        ),
        status: "error",
        closeHandler: closeAll,
      })
      if (!isUserRejection) {
        refetch()
      }
      setValue("withdrawAmount", 0)
    }
  }

  return (
    <>
      <VStack
        as="form"
        spacing={8}
        align="stretch"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl isInvalid={isError as boolean | undefined}>
          <Stack spacing={2}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              Enter Amount
            </Text>
            <HStack
              backgroundColor="surface.tertiary"
              justifyContent="space-between"
              borderRadius={16}
              px={4}
              py={3}
              height="64px"
            >
              <HStack>
                <Image
                  width="16px"
                  height="16px"
                  src={cellarConfig.lpToken.imagePath}
                  alt="coinlogo"
                />
                <Text fontWeight="semibold">
                  {lpTokenData?.symbol}
                </Text>
              </HStack>
              <VStack spacing={0} align="flex-end">
                <Input
                  id="amount"
                  variant="unstyled"
                  pr="2"
                  type="number"
                  step="any"
                  defaultValue="0.00"
                  placeholder="0.00"
                  fontSize="lg"
                  fontWeight={700}
                  textAlign="right"
                  {...register("withdrawAmount", {
                    onChange: (event) => {
                      let val = event.target.value

                      const decimalPos = val.indexOf(".")

                      if (
                        decimalPos !== -1 &&
                        val.length - decimalPos - 1 >
                          cellarConfig.cellar.decimals
                      ) {
                        val = val.substring(
                          0,
                          decimalPos +
                            cellarConfig.cellar.decimals +
                            1
                        ) // Keep token decimal places as max
                        event.target.value = val
                      }
                    },
                    required: "Enter amount",
                    valueAsNumber: true,
                    validate: {
                      positive: (v) =>
                        v > 0 || "You must submit a positive amount.",
                      balance: (v) =>
                        v <=
                          parseFloat(
                            toEther(
                              lpTokenData?.formatted,
                              lpTokenData?.decimals,
                              false,
                              6
                            )
                          ) || "Insufficient balance",
                    },
                  })}
                />
                <HStack spacing={0} fontSize="10px">
                  {isBalanceLoading ? (
                    <Spinner size="xs" mr="2" />
                  ) : (
                    <>
                      <Text as="span">
                        Available:{" "}
                        {(lpTokenData &&
                          toEther(
                            lpTokenData.value,
                            lpTokenData.decimals,
                            false,
                            6
                          )) ||
                          "--"}
                      </Text>
                      <Button
                        variant="unstyled"
                        p={0}
                        w="max-content"
                        h="max-content"
                        textTransform="uppercase"
                        fontSize="inherit"
                        fontWeight={600}
                        onClick={setMax}
                      >
                        max
                      </Button>
                    </>
                  )}
                </HStack>
              </VStack>
            </HStack>

            <FormErrorMessage color="energyYellow">
              <Icon
                p={0.5}
                mr={1}
                color="surface.bg"
                bg="red.base"
                borderRadius="50%"
                as={AiOutlineInfo}
              />
              {errors.withdrawAmount?.message}
            </FormErrorMessage>
          </Stack>
        </FormControl>
        <Stack>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="neutral.400"
          >
            Transaction Details
          </Text>
          <Stack>
            <HStack
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Text color="neutral.300">Vault</Text>
              <Stack>
                <Text>{cellarDataMap[id].name}</Text>
              </Stack>
            </HStack>
          </Stack>
        </Stack>

        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
        >
          Submit
        </BaseButton>
      </VStack>
    </>
  )
}
