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
  Tooltip,
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
import { useUserBalances } from "data/hooks/useUserBalances"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { getTokenConfig, Token } from "data/tokenConfig"
import {
  bondingPeriodOptions,
  isBondButtonEnabled,
  isBondedDisabled,
  isBondingEnabled,
  isRewardsEnabled,
  lpTokenTooltipContent,
  showNetValueInAsset,
} from "data/uiConfig"
import { formatDistanceToNowStrict, isFuture } from "date-fns"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useRouter } from "next/router"
import { useEffect, useState, VFC } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { formatDecimals } from "utils/bigNumber"
import { toEther } from "utils/formatCurrency"
import { formatDistance } from "utils/formatDistance"
import { useAccount, useContract, useSigner } from "wagmi"
import BondingTableCard from "../BondingTableCard"
import { InnerCard } from "../InnerCard"
import { TransparentCard } from "../TransparentCard"
import { Rewards } from "./Rewards"
import { useNetwork } from "wagmi"
import WithdrawQueueCard from "../WithdrawQueueCard"
import withdrawQueueV0821 from "src/abi/atomic-queue-v0.8.21.json"
import { add } from "lodash"

export const PortfolioCard: VFC<BoxProps> = (props) => {
  const theme = useTheme()
  const isMounted = useIsMounted()
  const { address, isConnected } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const slug = cellarDataMap[id].slug
  const dashboard = cellarDataMap[id].dashboard

  const depositTokens = cellarDataMap[id].depositTokens.list
  const depositTokenConfig = getTokenConfig(
    depositTokens,
    cellarConfig.chain.id
  ) as Token[]

  const { lpToken } = useUserBalances(cellarConfig)
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

  // Make sure the user is on the same chain as the strategy
  const { chain: wagmiChain } = useNetwork()
  let buttonsEnabled = true
  if (strategyData?.config.chain.wagmiId !== wagmiChain?.id!) {
    // Override userdata so as to not confuse people if they're on the wrong chain
    userData = undefined
    lpTokenData = undefined
    buttonsEnabled = false
  }

  const netValue = userData?.userStrategyData.userData?.netValue
  const userStakes = userData?.userStakes

  const staticCelarConfig = cellarConfig

  const totalShares =
    userData?.userStrategyData.userData?.totalShares.value
  const { data, isLoading } = useGetPreviewRedeem({
    cellarConfig: staticCelarConfig,
    value: totalShares?.toString(),
  })

  // Query withdraw queue status, disable queue button if there is active withdraw pending to prevent confusion
  const { data: signer } = useSigner()
  const withdrawQueueContract = useContract({
    address: cellarConfig.chain.withdrawQueueAddress,
    abi: withdrawQueueV0821,
    signerOrProvider: signer,
  })!

  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)

  // Check if a user has an active withdraw request
  const checkWithdrawRequest = async () => {
    try {
      if (withdrawQueueContract && address && cellarConfig) {
        const withdrawRequest =
          await withdrawQueueContract?.getUserAtomicRequest(
            address,
            cellarConfig.cellar.address
          )

        // Check if it's valid
        const isWithdrawRequestValid =
          await withdrawQueueContract?.isAtomicRequestValid(
            cellarConfig.cellar.address,
            address,
            withdrawRequest
          )
        setIsActiveWithdrawRequest(isWithdrawRequestValid)
      } else {
        setIsActiveWithdrawRequest(false)
      }
    } catch (error) {
      console.log(error)
      setIsActiveWithdrawRequest(false)
    }
  }

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
                  (isConnected && !isLoading
                    ? `${formatDecimals(
                        data?.toString() || "0",
                        lpTokenData?.decimals
                      )} ${activeAsset?.symbol}`
                    : "--")}
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
                        <WithdrawButton
                          isDeprecated={strategyData?.deprecated}
                          disabled={
                            lpTokenDisabled || !buttonsEnabled
                          }
                        />
                      </HStack>
                      {
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
                      }
                    </VStack>
                  </>
                ) : (
                  <>
                    <HStack paddingTop={"1em"}>
                      <ConnectButton
                        overrideChainId={cellarConfig.chain.id}
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
                              lpTokenData.formatted,
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
                    {isBondButtonEnabled(cellarConfig) &&
                      isStakingAllowed &&
                      isMounted && (
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
            {/* Show if only nothing staked */}
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
                          alt="sommelier logo"
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
