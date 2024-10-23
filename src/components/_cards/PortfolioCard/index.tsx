import React, { useEffect, useState } from "react"
import {
  Avatar,
  BoxProps,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { TokenAssets } from "components/TokenAssets"
import { BondButton } from "components/_buttons/BondButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { WithdrawQueueButton } from "components/_buttons/WithdrawQueueButton"
import { LighterSkeleton } from "components/_skeleton"
import { cellarDataMap } from "data/cellarDataMap"
import { useGetPreviewRedeem } from "data/hooks/useGetPreviewRedeem"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { getTokenConfig, Token } from "data/tokenConfig"
import {
  bondingPeriodOptions,
  isBondedDisabled,
  isBondingEnabled,
  isRewardsEnabled,
  lpTokenTooltipContent,
  showNetValueInAsset,
} from "data/uiConfig"
import { formatDistanceToNowStrict, isFuture } from "date-fns"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useRouter } from "next/router"
import { FaExternalLinkAlt } from "react-icons/fa"
import { toEther } from "utils/formatCurrency"
import { formatDistance } from "utils/formatDistance"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { getAddress, getContract } from "viem"
import BondingTableCard from "../BondingTableCard"
import { InnerCard } from "../InnerCard"
import { TransparentCard } from "../TransparentCard"
import { Rewards } from "./Rewards"
import WithdrawQueueCard from "../WithdrawQueueCard"
import withdrawQueueV0821 from "src/abi/withdraw-queue-v0.8.21.json"
import { CellarNameKey, ConfigProps } from "data/types"
import { MerklePoints } from "./MerklePoints/MerklePoints"

export const PortfolioCard = (props: BoxProps) => {
  const theme = useTheme()
  const isMounted = useIsMounted()
  const {
    address,
    isConnected: connected,
    chain: wagmiChain,
  } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const slug = cellarDataMap[id].slug
  const dashboard = cellarDataMap[id].dashboard

  const depositTokens = cellarDataMap[id].depositTokens.list
  const depositTokenConfig = getTokenConfig(
    depositTokens,
    cellarConfig.chain.id
  ) as Token[]

  const [isConnected, setConnected] = useState(false)
  useEffect(() => {
    setConnected(connected)
  }, [connected])

  const { lpToken } = useUserBalance(cellarConfig)
  let { data: lpTokenData } = lpToken
  const lpTokenDisabled =
    !lpTokenData || Number(lpTokenData?.value ?? "0") <= 0

  const { data: strategyData, isLoading: isStrategyLoading } =
    useStrategyData(
      cellarConfig.cellar.address,
      cellarConfig.chain.id
    )
  let { data: userData, isLoading: isUserDataLoading } =
    useUserStrategyData(
      cellarConfig.cellar.address,
      cellarConfig.chain.id
    )

  const activeAsset = strategyData?.activeAsset
  const stakingEnd = strategyData?.stakingEnd
  const bondingPeriods = bondingPeriodOptions(cellarConfig)
  const maxMultiplier = bondingPeriods[
    bondingPeriods.length - 1
  ]?.amount.replace("SOMM", "")

  const isStakingAllowed = stakingEnd?.endDate
    ? isFuture(stakingEnd.endDate)
    : false

  let buttonsEnabled = true
  if (strategyData?.config.chain.wagmiId !== wagmiChain?.id!) {
    userData = undefined
    lpTokenData = undefined
    buttonsEnabled = false
  }

  const netValue = userData?.userStrategyData.userData?.netValue
  const userStakes = userData?.userStakes

  const staticCelarConfig = cellarConfig

  const totalShares =
    userData?.userStrategyData.userData?.totalShares.value

  const baseAssetValue =
    userData?.userStrategyData.userData?.netValueInAsset.formatted
  const { data, isLoading } = useGetPreviewRedeem({
    cellarConfig: staticCelarConfig,
    value: totalShares?.toString(),
  })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const withdrawQueueContract =
    publicClient &&
    getContract({
      address: getAddress(cellarConfig.chain.withdrawQueueAddress),
      abi: withdrawQueueV0821,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })

  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)

  const checkWithdrawRequest = async () => {
    try {
      if (
        walletClient &&
        withdrawQueueContract &&
        address &&
        cellarConfig
      ) {
        const withdrawRequest =
          await withdrawQueueContract?.read.getUserWithdrawRequest([
            address,
            cellarConfig.cellar.address,
          ])

        const isWithdrawRequestValid =
          (await withdrawQueueContract?.read.isWithdrawRequestValid([
            cellarConfig.cellar.address,
            address,
            withdrawRequest,
          ])) as unknown as boolean
        setIsActiveWithdrawRequest(isWithdrawRequestValid)
      } else {
        setIsActiveWithdrawRequest(false)
      }
    } catch (error) {
      console.log(error)
      setIsActiveWithdrawRequest(false)
    }
  }
  // const isMerkleRewardsException = (config: ConfigProps) => {
  //   return (
  //     config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH_ARB ||
  //     config.cellarNameKey === CellarNameKey.REAL_YIELD_USD_ARB
  //   )
  // }

  useEffect(() => {
    checkWithdrawRequest()
  }, [withdrawQueueContract, address, cellarConfig])

  return (
    <TransparentCard
      {...props}
      backgroundColor="surface.secondary"
      p={8}
      overflow="none"
      zIndex={1}
    >
      <VStack align="stretch" spacing={8}>
        <CardStatRow
          gap={{ base: 4, md: 8, lg: 12 }}
          align="flex-start"
          justify="flex-start"
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            templateColumns={{
              base: "repeat(1, max-content)",
              md: "repeat(2, max-content)",
            }}
          >
            <CardStat
              label="Net Value"
              tooltip="Net value of assets in the strategy including SOMM rewards"
            >
              {isMounted &&
                (isConnected ? netValue?.formatted || "..." : "--")}
            </CardStat>

            {showNetValueInAsset(cellarConfig) && (
              <CardStat
                label="Base Asset Value"
                tooltip={
                  <Text>
                    Total value of assets denominated in base asset
                    <Avatar
                      ml="-2.5px"
                      boxSize={6}
                      src={activeAsset?.src}
                      name={activeAsset?.alt}
                      borderWidth={2}
                      borderColor="surface.bg"
                      bg="surface.bg"
                    />
                    {activeAsset?.symbol}. excluding SOMM rewards
                  </Text>
                }
              >
                {isMounted &&
                  (isConnected && !isLoading ? baseAssetValue : "--")}
              </CardStat>
            )}

            <CardStat
              label="deposit assets"
              tooltip="Accepted deposit assets"
              alignSelf="flex-start"
              spacing={0}
            >
              <TokenAssets
                tokens={depositTokenConfig}
                activeAsset={activeAsset?.address || ""}
                displaySymbol
              />
            </CardStat>
            {/* TODO: Verify PNL result */}
            {/* <CardStat
              label="pnl"
              tooltip={`${
                ((outputUserData.data.pnl &&
                  outputUserData.data.pnl.value.toFixed(5, 0)) ||
                  "...") + "%"
              }: This represents percentage gains compared to current deposits`}
              labelProps={{
                textTransform: "uppercase",
              }}
            >
              {isConnected ? (
                <Apy
                  apy={
                    (outputUserData.data.pnl &&
                      `${outputUserData.data.pnl.formatted}`) ||
                    "..."
                  }
                />
              ) : (
                "--"
              )}
            </CardStat> */}
            <Stack spacing={3} direction="row">
              {isMounted &&
                (isConnected ? (
                  <>
                    <VStack
                      spacing={3}
                      width="100%"
                      paddingTop={"1em"}
                    >
                      <HStack>
                        {!strategyData?.deprecated && (
                          <DepositButton
                            disabled={
                              !isConnected ||
                              strategyData?.isContractNotReady ||
                              !buttonsEnabled
                            }
                          />
                        )}
                        {cellarConfig.cellarNameKey !==
                          CellarNameKey.REAL_YIELD_LINK && (
                          <WithdrawButton
                            isDeprecated={strategyData?.deprecated}
                            disabled={
                              lpTokenDisabled || !buttonsEnabled
                            }
                          />
                        )}
                      </HStack>
                      {/*
                      <>
                        <WithdrawQueueButton
                          chain={cellarConfig.chain}
                          buttonLabel="Enter Withdraw Queue"
                          disabled={
                            lpTokenDisabled ||
                            !buttonsEnabled ||
                            isActiveWithdrawRequest
                          }
                          showTooltip={true}
                        />
                      </>
                        */}
                      {cellarConfig.cellarNameKey ===
                        CellarNameKey.REAL_YIELD_LINK && (
                        <WithdrawQueueButton
                          chain={cellarConfig.chain}
                          buttonLabel="Enter Withdraw Queue"
                          showTooltip={true}
                        />
                      )}
                    </VStack>
                  </>
                ) : (
                  <>
                    <HStack paddingTop={"1em"}>
                      <ConnectButton
                        overridechainid={cellarConfig.chain.id}
                        unstyled
                      />
                    </HStack>
                  </>
                ))}
            </Stack>
          </SimpleGrid>
          {!isBondedDisabled(cellarConfig) ? (
            <>
              <SimpleGrid
                templateColumns="repeat(2, max-content)"
                templateRows="repeat(2, 1fr)"
                spacing={4}
                alignItems="flex-end"
              >
                <VStack align="flex-start">
                  <CardStat
                    label="Available LP Tokens"
                    tooltip={lpTokenTooltipContent(cellarConfig)}
                  >
                    {cellarConfig.lpToken.imagePath && (
                      <Image
                        src={cellarConfig.lpToken.imagePath}
                        alt="lp token image"
                        height="24px"
                        mr={2}
                      />
                    )}
                    {isMounted &&
                      (isConnected
                        ? (lpTokenData &&
                            toEther(
                              lpTokenData.value,
                              lpTokenData.decimals,
                              true,
                              2
                            )) ||
                          "..."
                        : "--")}
                  </CardStat>
                </VStack>
                {isBondingEnabled(cellarConfig) && (
                  <>
                    <VStack align="flex-start">
                      <CardStat
                        label="Bonded LP Tokens"
                        tooltip="Bonded LP tokens earn yield from the vault and liquidity mining rewards"
                      >
                        {isMounted &&
                          (isConnected
                            ? userStakes?.totalBondedAmount
                                .formatted || "..."
                            : "--")}
                      </CardStat>
                    </VStack>
                    {isMounted &&
                      /* isMerkleRewardsException(cellarConfig) || */ isStakingAllowed && (
                        <BondButton
                          disabled={
                            lpTokenDisabled || !buttonsEnabled
                          }
                        />
                      )}
                  </>
                )}
              </SimpleGrid>
              {isRewardsEnabled(cellarConfig) && (
                <Rewards cellarConfig={cellarConfig} />
              )}
            </>
          ) : (
            <VStack align="flex-start">
              <CardStat
                label="tokens"
                tooltip={lpTokenTooltipContent(cellarConfig)}
              >
                {cellarConfig.lpToken.imagePath && (
                  <Image
                    src={cellarConfig.lpToken.imagePath}
                    alt="lp token image"
                    height="24px"
                    mr={2}
                  />
                )}
                {isMounted &&
                  (isConnected
                    ? (lpTokenData &&
                        toEther(
                          lpTokenData.formatted,
                          lpTokenData.decimals,
                          true,
                          2
                        )) ||
                      "..."
                    : "--")}
              </CardStat>
            </VStack>
          )}

{
  (cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH_ARB ||
    cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_USD_ARB ||
    cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH_OPT) && (
    <MerklePoints
      userAddress={address}
      cellarConfig={cellarConfig}
    />
)}

          <CardStat label="Strategy Dashboard">
            {strategyData ? (
              <HStack
                as={Link}
                href={`${dashboard}`}
                target="_blank"
                rel="noreferrer"
              >
                <Text as="span" fontWeight="bold" fontSize={21}>
                  {strategyData?.name}
                </Text>
                <Icon as={FaExternalLinkAlt} color="purple.base" />
              </HStack>
            ) : (
              <Text>Loading...</Text>
            )}
          </CardStat>
        </CardStatRow>
        {isBondingEnabled(cellarConfig) && (
          <>
            {!userStakes?.userStakes.length &&
              stakingEnd?.endDate &&
              isFuture(stakingEnd?.endDate) && (
                <>
                  {cellarConfig.customReward
                    ?.customRewardLongMessage ? (
                    <InnerCard
                      backgroundColor="surface.tertiary"
                      mt={8}
                      px={7}
                      py={7}
                    >
                      <Stack
                        flexDir={{ base: "column", md: "row" }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        gap={{ base: 0, md: 4 }}
                      >
                        <>
                          <Image
                            src={cellarConfig.customReward?.imagePath}
                            alt={`${cellarConfig.customReward?.tokenSymbol} logo`}
                            boxSize={6}
                          />
                          <Heading size="16px">
                            {
                              cellarConfig.customReward
                                ?.customRewardLongMessage
                            }
                          </Heading>
                        </>

                        <Spacer />
                        <LighterSkeleton
                          isLoaded={!isStrategyLoading}
                          height={4}
                        >
                          <Text fontSize="xs">
                            {stakingEnd?.endDate &&
                            isFuture(stakingEnd.endDate)
                              ? `Rewards program ends in ${formatDistanceToNowStrict(
                                  cellarConfig.customReward
                                    ?.stakingDurationOverride ??
                                    stakingEnd.endDate,
                                  {
                                    locale: { formatDistance },
                                  }
                                )}`
                              : "Program Ended"}
                          </Text>
                        </LighterSkeleton>
                      </Stack>
                    </InnerCard>
                  ) : null}
                  {cellarConfig.customReward?.showSommRewards ||
                  cellarConfig.customReward?.showSommRewards ===
                    undefined ? (
                    <InnerCard
                      backgroundColor="surface.tertiary"
                      mt={8}
                      px={7}
                      py={7}
                    >
                      <Stack
                        flexDir={{ base: "column", md: "row" }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        gap={{ base: 0, md: 4 }}
                      >
                        <Image
                          src="/assets/icons/somm.png"
                          alt="somm logo"
                          boxSize={6}
                        />
                        <Heading size="16px">
                          Earn{" "}
                          <span
                            style={{
                              color: theme.colors.lime.base,
                            }}
                          >
                            {strategyData?.rewardsApy?.formatted}
                          </span>{" "}
                          APY in SOMM rewards when you bond.
                        </Heading>
                        <Spacer />
                        <LighterSkeleton
                          isLoaded={!isStrategyLoading}
                          height={4}
                        >
                          <Text fontSize="xs">
                            {stakingEnd?.endDate &&
                            isFuture(stakingEnd.endDate)
                              ? `Rewards program ends in ${formatDistanceToNowStrict(
                                  stakingEnd.endDate,
                                  {
                                    locale: { formatDistance },
                                  }
                                )}`
                              : "Program Ended"}
                          </Text>
                        </LighterSkeleton>
                      </Stack>
                    </InnerCard>
                  ) : null}
                </>
              )}
            {isConnected && (
              <LighterSkeleton
                h={!isUserDataLoading ? "none" : "100px"}
                borderRadius={24}
                isLoaded={!isUserDataLoading}
              >
                {isConnected &&
                  Boolean(userStakes?.userStakes.length) && (
                    <BondingTableCard />
                  )}
              </LighterSkeleton>
            )}
            {isConnected && isActiveWithdrawRequest && (
              <LighterSkeleton
                h={!isUserDataLoading ? "none" : "100px"}
                borderRadius={24}
                isLoaded={!isUserDataLoading}
              >
                {isConnected && <WithdrawQueueCard />}
              </LighterSkeleton>
            )}
          </>
        )}
      </VStack>
    </TransparentCard>
  )
}
