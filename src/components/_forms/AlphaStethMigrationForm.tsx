import React, { useEffect, useState } from "react"
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
  Alert,
  AlertIcon,
  Box,
  Flex,
  Badge,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { toEther } from "utils/formatCurrency"

import { useUserBalance } from "data/hooks/useUserBalance"
import { useGeo } from "context/geoContext"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { erc20Abi, getAddress, getContract, parseUnits } from "viem"

import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { config as utilConfig } from "utils/config"
import { CellarKey, CellarNameKey, ConfigProps } from "data/types"
import { chainConfigMap } from "data/chainConfig"

interface FormValues {
  withdrawAmount: number
  sourceVault: "real-yield-eth" | "turbo-steth" | null
}

interface AlphaStethMigrationFormProps {
  onClose: () => void
  onSuccessfulMigration?: () => void
}

type IngestEvent = Record<string, unknown>

export const AlphaStethMigrationForm = ({
  onClose,
  onSuccessfulMigration,
}: AlphaStethMigrationFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { addToast, close, closeAll } = useBrandedToast()
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const [sourceVault, setSourceVault] = useState<
    "real-yield-eth" | "turbo-steth" | null
  >(null)
  const [migrationStep, setMigrationStep] = useState<
    "checking" | "selection" | "withdraw" | "deposit" | "complete"
  >("checking")

  // Get vault configurations safely (validate keys before access)
  const RYE_SLUG = utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG
  const TSTETH_SLUG = utilConfig.CONTRACT.TURBO_STETH.SLUG
  const ALPHA_SLUG = utilConfig.CONTRACT.ALPHA_STETH.SLUG

  const realYieldEthEntry = cellarDataMap[RYE_SLUG]
  const turboStethEntry = cellarDataMap[TSTETH_SLUG]
  const alphaStethEntry = cellarDataMap[ALPHA_SLUG]

  // Use a deterministic dummy config to keep hooks stable without risking wrong on-chain calls
  const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
  const DUMMY_CONFIG: ConfigProps = {
    id: "dummy",
    cellarNameKey: CellarNameKey.ALPHA_STETH,
    lpToken: { address: ZERO_ADDR, imagePath: "" },
    cellar: {
      address: ZERO_ADDR,
      abi: [] as ConfigProps["cellar"]["abi"],
      key: CellarKey.CELLAR_V0816,
      decimals: 18,
    },
    baseAsset: {
      src: "",
      alt: "dummy",
      symbol: "DUMMY",
      address: ZERO_ADDR,
      coinGeckoId: "",
      decimals: 18,
      chain: chainConfigMap["ethereum"].id,
    },
    chain: chainConfigMap["ethereum"],
  }

  const realYieldEthConfig = realYieldEthEntry?.config || DUMMY_CONFIG
  const turboStethConfig = turboStethEntry?.config || DUMMY_CONFIG
  const alphaStethConfig = alphaStethEntry?.config || DUMMY_CONFIG

  // Check user balances in both source vaults; gate queries if entry missing
  const { lpToken: realYieldEthBalance } = useUserBalance(
    realYieldEthConfig,
    Boolean(realYieldEthEntry)
  )
  const { lpToken: turboStethBalance } = useUserBalance(
    turboStethConfig,
    Boolean(turboStethEntry)
  )

  const { boringVaultLens } =
    useCreateContracts(alphaStethConfig)

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  // Check user positions on load
  useEffect(() => {
    const checkPositions = async () => {
      if (!address) {
        setMigrationStep("selection")
        return
      }

      const realYieldEthHasBalance =
        realYieldEthBalance.data &&
        parseFloat(
          toEther(
            realYieldEthBalance.data.value,
            realYieldEthBalance.data.decimals,
            false,
            6
          )
        ) > 0

      const turboStethHasBalance =
        turboStethBalance.data &&
        parseFloat(
          toEther(
            turboStethBalance.data.value,
            turboStethBalance.data.decimals,
            false,
            6
          )
        ) > 0

      if (realYieldEthHasBalance && turboStethHasBalance) {
        // User has positions in both - let them choose
        setMigrationStep("selection")
      } else if (realYieldEthHasBalance) {
        setSourceVault("real-yield-eth")
        setMigrationStep("withdraw")
      } else if (turboStethHasBalance) {
        setSourceVault("turbo-steth")
        setMigrationStep("withdraw")
      } else {
        // No positions found
        setMigrationStep("selection")
      }
    }

    if (
      realYieldEthBalance.data !== undefined &&
      turboStethBalance.data !== undefined
    ) {
      checkPositions()
    }
  }, [realYieldEthBalance.data, turboStethBalance.data, address])

  const setMax = () => {
    if (!sourceVault) return

    const balanceData =
      sourceVault === "real-yield-eth"
        ? realYieldEthBalance.data
        : turboStethBalance.data

    if (balanceData) {
      const amount = parseFloat(
        toEther(balanceData.value, balanceData.decimals, false, 6)
      )
      setValue("withdrawAmount", amount)
    }
  }

  const getSourceVaultConfig = () => {
    return sourceVault === "real-yield-eth"
      ? realYieldEthConfig
      : turboStethConfig
  }

  const getSourceVaultData = () => {
    return sourceVault === "real-yield-eth"
      ? cellarDataMap[utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG]
      : cellarDataMap[utilConfig.CONTRACT.TURBO_STETH.SLUG]
  }

  const getCurrentBalance = () => {
    return sourceVault === "real-yield-eth"
      ? realYieldEthBalance
      : turboStethBalance
  }

  const geo = useGeo()

  // Attribution: helper to send events to ingestion API
  const sendIngest = async (evt: IngestEvent) => {
    try {
      if (process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED !== "true")
        return
      await fetch("/api/ingest-rpc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events: [evt] }),
        keepalive: true,
      })
    } catch {}
  }

  const onSubmit = async ({ withdrawAmount }: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) return
    if (withdrawAmount <= 0 || !sourceVault) return

    const sourceConfig = getSourceVaultConfig()

    // Validate required configs exist for the chosen source and destination
    if (
      (sourceVault === "real-yield-eth" && !realYieldEthEntry) ||
      (sourceVault === "turbo-steth" && !turboStethEntry)
    ) {
      addToast({
        heading: "Unsupported Migration",
        body: <Text>Source vault configuration unavailable.</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      return
    }
    if (!alphaStethEntry) {
      addToast({
        heading: "Migration Unavailable",
        body: <Text>Alpha STETH configuration unavailable.</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      return
    }

    if (!address || !publicClient) {
      addToast({
        heading: "Connect Wallet",
        body: <Text>Please connect your wallet to continue.</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      return
    }

    try {
      // Pre-check: ensure enough instant liquidity to avoid Withdraw Queue
      const sourceSlug =
        sourceVault === "real-yield-eth"
          ? utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG
          : utilConfig.CONTRACT.TURBO_STETH.SLUG

      // Redeemable (instant) assets available in the vault
      const redeemableAssets: number = parseInt(
        await fetchCellarRedeemableReserves(sourceSlug)
      )
      // Assets per 1 share (scaled); pass 1 share in base decimals
      const previewPerShare: number = parseInt(
        await fetchCellarPreviewRedeem(
          sourceSlug,
          BigInt(10 ** sourceConfig.cellar.decimals)
        )
      )
      // Requested assets (scaled) = per-share assets * share amount
      const requestedAssetsScaled: number = Math.floor(
        previewPerShare * withdrawAmount
      )

      if (requestedAssetsScaled > redeemableAssets) {
        addToast({
          heading: "Insufficient Instant Liquidity",
          body: (
            <VStack align="start" spacing={2}>
              <Text>
                Your requested amount exceeds the vault’s liquid
                reserves for immediate withdrawal. To avoid the
                withdrawal queue, try a smaller amount or withdraw
                later when liquidity improves.
              </Text>
              <Text fontSize="sm" color="neutral.400">
                Tip: You can also submit a withdraw request from the
                source vault’s manage page.
              </Text>
            </VStack>
          ),
          status: "info",
          closeHandler: closeAll,
        })
        return
      }

      setMigrationStep("withdraw")

      // Step 1: Withdraw from source vault
      const sourceContract = getContract({
        address: getAddress(sourceConfig.cellar.address),
        abi: sourceConfig.cellar.abi,
        client: { public: publicClient },
      })

      const amtInWei = parseUnits(
        `${withdrawAmount}`,
        sourceConfig.cellar.decimals
      )

      // Get amount of base asset from withdrawal
      const amountOfBaseAsset =
        (await sourceContract.read.convertToAssets([
          amtInWei,
        ])) as bigint

      // Execute withdrawal
      addToast({
        heading: "Step 1: Withdrawing from Source Vault",
        body: (
          <Text>
            Withdrawing {withdrawAmount} tokens from{" "}
            {getSourceVaultData().name}...
          </Text>
        ),
        status: "info",
        closeHandler: close,
      })

      const withdrawHash = await writeContractAsync({
        address: sourceConfig.cellar.address as `0x${string}`,
        abi: sourceConfig.cellar.abi,
        functionName: "withdraw",
        args: [amountOfBaseAsset, address, address],
      })

      await publicClient.waitForTransactionReceipt({
        hash: withdrawHash,
      })

      setMigrationStep("deposit")

      // Step 2: Check allowance and approve for Alpha STETH if needed
      const erc20Contract = getContract({
        address: getAddress(sourceConfig.baseAsset.address),
        abi: erc20Abi,
        client: { public: publicClient },
      })

      const allowance = await erc20Contract.read.allowance([
        getAddress(address),
        getAddress(alphaStethConfig.cellar.address),
      ])

      let needsApproval = allowance < amountOfBaseAsset
      if (needsApproval) {
        addToast({
          heading: "Step 2: Approving Token",
          body: (
            <Text>Approving tokens for Alpha STETH deposit...</Text>
          ),
          status: "info",
          closeHandler: close,
        })

        const approvalHash = await writeContractAsync({
          address: sourceConfig.baseAsset.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            alphaStethConfig.cellar.address as `0x${string}`,
            amountOfBaseAsset,
          ],
        })

        await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
        })
      }

      // Step 3: Get minimum mint amount for Alpha STETH
      const minimumMint =
        boringVaultLens &&
        (await boringVaultLens.read.previewDeposit([
          sourceConfig.baseAsset.address,
          amountOfBaseAsset,
          alphaStethConfig.cellar.address,
          alphaStethConfig.accountant?.address,
        ]))

      // Step 4: Execute deposit to Alpha STETH
      addToast({
        heading: "Step 3: Depositing to Alpha STETH",
        body: <Text>Depositing funds into Alpha STETH vault...</Text>,
        status: "info",
        closeHandler: close,
      })

      // Attribution: record deposit initiation
      try {
        const domain = window.location.hostname
        const pagePath =
          window.location.pathname + window.location.search
        const sessionId =
          localStorage.getItem("somm_session_id") ||
          crypto.randomUUID()
        localStorage.setItem("somm_session_id", sessionId)
        const toAddress = (alphaStethConfig.teller?.address ||
          alphaStethConfig.cellar.address) as string
        await sendIngest({
          stage: "request",
          domain,
          pagePath,
          sessionId,
          wallet: (address || "").toLowerCase(),
          chainId: alphaStethConfig.chain.wagmiId,
          method: "deposit",
          paramsRedacted: {
            token: sourceConfig.baseAsset.address,
            amountWei: String(amountOfBaseAsset),
          },
          to: toAddress,
          contractMatch: true,
          strategyKey: "ALPHA_STETH",
          amount: String(amountOfBaseAsset),
          status: "started",
          timestampMs: Date.now(),
        })
      } catch {}

      const depositHash = await writeContractAsync({
        address: alphaStethConfig.teller?.address as `0x${string}`,
        abi: (alphaStethConfig.teller?.abi ??
          []) as ConfigProps["cellar"]["abi"],
        functionName: "deposit",
        args: [
          sourceConfig.baseAsset.address,
          amountOfBaseAsset,
          minimumMint,
          (alphaStethConfig.teller?.referred ??
            ZERO_ADDR) as `0x${string}`,
        ],
      })

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: depositHash,
      })

      if (receipt.status === "success") {
        // Attribution: record deposit receipt
        try {
          const domain = window.location.hostname
          const pagePath =
            window.location.pathname + window.location.search
          const sessionId =
            localStorage.getItem("somm_session_id") ||
            crypto.randomUUID()
          localStorage.setItem("somm_session_id", sessionId)
          const toAddress = (alphaStethConfig.teller?.address ||
            alphaStethConfig.cellar.address) as string
          await sendIngest({
            stage: "receipt",
            domain,
            pagePath,
            sessionId,
            wallet: (address || "").toLowerCase(),
            chainId: alphaStethConfig.chain.wagmiId,
            method: "deposit",
            txHash: depositHash,
            to: toAddress,
            contractMatch: true,
            strategyKey: "ALPHA_STETH",
            amount: String(amountOfBaseAsset),
            blockNumber: Number(receipt?.blockNumber ?? 0n),
            blockHash: receipt?.blockHash,
            status: "success",
            token: sourceConfig.baseAsset.symbol,
            decimals: sourceConfig.baseAsset.decimals,
            timestampMs: Date.now(),
          })
        } catch {}
        setMigrationStep("complete")
        addToast({
          heading: "Migration Complete!",
          body: (
            <VStack align="start" spacing={2}>
              <Text>
                Successfully migrated {withdrawAmount} tokens
              </Text>
              <Text fontSize="sm">
                From: {getSourceVaultData().name}
              </Text>
              <Text fontSize="sm">To: Alpha STETH</Text>
            </VStack>
          ),
          status: "success",
          closeHandler: close,
        })

        onSuccessfulMigration?.()
        onClose()
      } else {
        addToast({
          heading: "Migration Failed",
          body: (
            <Text>
              Migration failed during deposit. Please try again.
            </Text>
          ),
          status: "error",
          closeHandler: close,
        })
      }
    } catch (e) {
      const error = e as Error
      const isUserRejection = error.message?.includes("User rejected")

      // Attribution: record deposit error if we were in deposit phase
      try {
        const domain = window.location.hostname
        const pagePath =
          window.location.pathname + window.location.search
        const sessionId =
          localStorage.getItem("somm_session_id") ||
          crypto.randomUUID()
        localStorage.setItem("somm_session_id", sessionId)
        const toAddress = (alphaStethConfig.teller?.address ||
          alphaStethConfig.cellar.address) as string
        await sendIngest({
          stage: "error",
          domain,
          pagePath,
          sessionId,
          wallet: (address || "").toLowerCase(),
          chainId: alphaStethConfig.chain.wagmiId,
          method: "deposit",
          to: toAddress,
          contractMatch: true,
          strategyKey: "ALPHA_STETH",
          status: isUserRejection ? "user_rejected" : "error",
          timestampMs: Date.now(),
        })
      } catch {}

      addToast({
        heading: "Migration Error",
        body: (
          <Text>
            {isUserRejection
              ? "Migration cancelled by user"
              : "Migration failed. Please try manual migration."}
          </Text>
        ),
        status: "error",
        closeHandler: closeAll,
      })

      setValue("withdrawAmount", 0)
      setMigrationStep(sourceVault ? "withdraw" : "selection")
    }
  }

  // Render position selection if user has multiple positions
  if (migrationStep === "checking") {
    return (
      <VStack spacing={6} align="center" py={8}>
        <Spinner size="lg" />
        <Text>Checking your vault positions...</Text>
      </VStack>
    )
  }

  if (migrationStep === "selection") {
    return (
      <VStack spacing={6} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          Choose Source Vault
        </Text>
        <Text color="neutral.400">
          Select which vault you&apos;d like to migrate from to Alpha
          STETH:
        </Text>

        <Stack spacing={4}>
          {/* Real Yield ETH Option */}
          <Box
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor={
              sourceVault === "real-yield-eth"
                ? "purple.base"
                : "neutral.600"
            }
            cursor="pointer"
            onClick={() => {
              setSourceVault("real-yield-eth")
              setMigrationStep("withdraw")
            }}
            bg={
              sourceVault === "real-yield-eth"
                ? "purple.dark"
                : "surface.secondary"
            }
          >
            <Flex justify="space-between" align="center">
              <HStack>
                <Image
                  width="32px"
                  height="32px"
                  src="/assets/icons/real-yield-eth.png"
                  alt="Real Yield ETH"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="semibold">Real Yield ETH</Text>
                  <Text fontSize="sm" color="neutral.400">
                    Balance:{" "}
                    {realYieldEthBalance.data
                      ? toEther(
                          realYieldEthBalance.data.value,
                          realYieldEthBalance.data.decimals,
                          false,
                          6
                        )
                      : "0.00"}
                  </Text>
                </VStack>
              </HStack>
              {parseFloat(
                toEther(
                  realYieldEthBalance.data?.value,
                  realYieldEthBalance.data?.decimals,
                  false,
                  6
                )
              ) > 0 && (
                <Badge colorScheme="green" variant="subtle">
                  Available
                </Badge>
              )}
            </Flex>
          </Box>

          {/* Turbo stETH Option */}
          <Box
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor={
              sourceVault === "turbo-steth"
                ? "purple.base"
                : "neutral.600"
            }
            cursor="pointer"
            onClick={() => {
              setSourceVault("turbo-steth")
              setMigrationStep("withdraw")
            }}
            bg={
              sourceVault === "turbo-steth"
                ? "purple.dark"
                : "surface.secondary"
            }
          >
            <Flex justify="space-between" align="center">
              <HStack>
                <Image
                  width="32px"
                  height="32px"
                  src="/assets/icons/turbo-steth.png"
                  alt="Turbo stETH"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="semibold">Turbo stETH</Text>
                  <Text fontSize="sm" color="neutral.400">
                    Balance:{" "}
                    {turboStethBalance.data
                      ? toEther(
                          turboStethBalance.data.value,
                          turboStethBalance.data.decimals,
                          false,
                          6
                        )
                      : "0.00"}
                  </Text>
                </VStack>
              </HStack>
              {parseFloat(
                toEther(
                  turboStethBalance.data?.value,
                  turboStethBalance.data?.decimals,
                  false,
                  6
                )
              ) > 0 && (
                <Badge colorScheme="green" variant="subtle">
                  Available
                </Badge>
              )}
            </Flex>
          </Box>
        </Stack>
      </VStack>
    )
  }

  if (!sourceVault) return null

  const sourceVaultData = getSourceVaultData()
  const sourceVaultConfig = getSourceVaultConfig()
  const currentBalance = getCurrentBalance()

  return (
    <VStack
      as="form"
      spacing={8}
      align="stretch"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Migration Info */}
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold">
            Migrating from {sourceVaultData.name} to Alpha STETH
          </Text>
          <Text fontSize="sm">
            This will withdraw your funds and automatically deposit
            them into Alpha STETH
          </Text>
        </VStack>
      </Alert>

      {/* Amount Input */}
      <FormControl isInvalid={isError as boolean | undefined}>
        <Stack spacing={2}>
          <Text fontWeight="bold" color="neutral.400" fontSize="xs">
            Enter Migration Amount
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
                src={sourceVaultConfig.lpToken.imagePath}
                alt="source vault logo"
              />
              <Text fontWeight="semibold">
                {currentBalance.data?.symbol}
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
                  required: "Enter amount",
                  valueAsNumber: true,
                  validate: {
                    positive: (v) =>
                      v > 0 || "You must submit a positive amount.",
                    balance: (v) => {
                      const maxBalance = parseFloat(
                        toEther(
                          currentBalance.data?.value,
                          currentBalance.data?.decimals,
                          false,
                          6
                        )
                      )
                      return v <= maxBalance || "Insufficient balance"
                    },
                  },
                })}
              />
              <HStack spacing={0} fontSize="10px">
                {currentBalance.isLoading ? (
                  <Spinner size="xs" mr="2" />
                ) : (
                  <>
                    <Text as="span">
                      Available:{" "}
                      {(currentBalance.data &&
                        toEther(
                          currentBalance.data.value,
                          currentBalance.data.decimals,
                          false,
                          6
                        )) ||
                        "0.00"}
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

      {/* Transaction Details */}
      <Stack>
        <Text fontSize="sm" fontWeight="semibold" color="neutral.400">
          Migration Details
        </Text>
        <Stack spacing={2}>
          <HStack justifyContent="space-between">
            <Text color="neutral.300">From</Text>
            <Text>{sourceVaultData.name}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text color="neutral.300">To</Text>
            <Text>Alpha STETH</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text color="neutral.300">Steps</Text>
            <Text fontSize="sm">Withdraw → Approve → Deposit</Text>
          </HStack>
        </Stack>
      </Stack>

      {/* Action Buttons */}
      <HStack spacing={4}>
        <Button
          variant="ghost"
          onClick={() => {
            setSourceVault(null)
            setMigrationStep("selection")
          }}
          flex={1}
        >
          Back
        </Button>
        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
          flex={2}
        >
          {migrationStep === "withdraw" && "Start Migration"}
          {migrationStep === "deposit" && "Completing Migration..."}
          {migrationStep === "complete" && "Migration Complete"}
        </BaseButton>
      </HStack>
    </VStack>
  )
}
