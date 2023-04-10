import {
  BoxProps,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { TransparentCard } from "../TransparentCard"
import { toEther } from "utils/formatCurrency"
import BondingTableCard from "../BondingTableCard"
import { useAccount } from "wagmi"
import { getTokenConfig, Token } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useUserBalances } from "data/hooks/useUserBalances"
import { Rewards } from "./Rewards"
import {
  bondingPeriodOptions,
  isBondButtonEnabled,
  isBondingEnabled,
  isRewardsEnabled,
  lpTokenTooltipContent,
} from "data/uiConfig"
import { BondButton } from "components/_buttons/BondButton"
import { InnerCard } from "../InnerCard"
import { formatDistanceToNow, isFuture } from "date-fns"
import { LighterSkeleton } from "components/_skeleton"
import { formatDistance } from "utils/formatDistance"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"

export const PortfolioCard: VFC<BoxProps> = (props) => {
  const theme = useTheme()
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const depositTokens = cellarDataMap[id].depositTokens.list
  const depositTokenConfig = getTokenConfig(depositTokens) as Token[]

  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData } = lpToken
  const lpTokenDisabled =
    !lpTokenData ||
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <=
      0

  const { data: strategyData, isLoading: isStrategyLoading } =
    useStrategyData(cellarConfig.cellar.address)
  const { data: userData, isLoading: isUserDataLoading } =
    useUserStrategyData(cellarConfig.cellar.address)

  const activeAsset = strategyData?.activeAsset
  const stakingEnd = strategyData?.stakingEnd
  const bondingPeriods = bondingPeriodOptions(cellarConfig)
  const maxMultiplier = bondingPeriods
    .at(-1)
    ?.amount.replace("SOMM", "")
  const isStakingAllowed = stakingEnd?.endDate
    ? isFuture(stakingEnd.endDate)
    : true

  const netValue = userData?.userStrategyData.userData?.netValue
  const userStakes = userData?.userStakes

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
          gap={{ base: 4, md: 8, lg: 14 }}
          align="flex-start"
          justify="flex-start"
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            templateColumns="repeat(2, max-content)"
            templateRows="1fr 1fr"
            spacing={4}
            alignItems="flex-end"
          >
            <CardStat
              label="net value"
              tooltip="Current value of your assets in Strategy"
            >
              {isMounted &&
                (isConnected ? netValue?.formatted || "..." : "--")}
            </CardStat>

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
                    <DepositButton disabled={!isConnected} />
                    <WithdrawButton disabled={lpTokenDisabled} />
                  </>
                ) : (
                  <ConnectButton unstyled />
                ))}
            </Stack>
          </SimpleGrid>
          <SimpleGrid
            templateColumns="repeat(2, max-content)"
            templateRows="repeat(2, 1fr)"
            spacing={4}
            alignItems="flex-end"
          >
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
            {isBondingEnabled(cellarConfig) && (
              <>
                <VStack align="flex-start">
                  <CardStat
                    label="bonded tokens"
                    tooltip="Bonded LP tokens earn yield from strategy and accrue Liquidity Mining rewards based on bonding period length"
                  >
                    {isMounted &&
                      (isConnected
                        ? userStakes?.totalBondedAmount.formatted ||
                          "..."
                        : "--")}
                  </CardStat>
                </VStack>
                {isBondButtonEnabled(cellarConfig) &&
                  isStakingAllowed &&
                  isMounted && (
                    <BondButton disabled={lpTokenDisabled} />
                  )}
              </>
            )}
          </SimpleGrid>
          {isRewardsEnabled(cellarConfig) && (
            <Rewards cellarConfig={cellarConfig} />
          )}
        </CardStatRow>
        {isBondingEnabled(cellarConfig) && (
          <>
            {/* Show if only nothing staked */}
            {!userStakes?.userStakes.length &&
              stakingEnd?.endDate &&
              isFuture(stakingEnd?.endDate) && (
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
                      <span style={{ color: theme.colors.lime.base }}>
                        {strategyData?.rewardsApy?.formatted}
                      </span>{" "}
                      and {maxMultiplier} in SOMM rewards when you
                      bond.
                    </Heading>
                    <Spacer />
                    <LighterSkeleton
                      isLoaded={!isStrategyLoading}
                      height={4}
                    >
                      <Text fontSize="xs">
                        {stakingEnd?.endDate &&
                        isFuture(stakingEnd.endDate)
                          ? `Ends in ${formatDistanceToNow(
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
          </>
        )}
      </VStack>
    </TransparentCard>
  )
}
