import {
  BoxProps,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { TransparentCard } from "../TransparentCard"
import { toEther } from "utils/formatCurrency"
import BondingTableCard from "../BondingTableCard"
import { useAccount, useConnect } from "wagmi"
import { getTokenConfig, Token } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import { DepositButton } from "components/_buttons/DepositButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useUserStakes } from "data/hooks/useUserStakes"
import { useNetValue } from "data/hooks/useNetValue"
import { useActiveAsset } from "data/hooks/useActiveAsset"
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
import { useApy } from "data/hooks/useApy"
import { InnerCard } from "../InnerCard"
import { formatDistanceToNow, isFuture } from "date-fns"
import { useStakingEnd } from "data/hooks/useStakingEnd"
import { LighterSkeleton } from "components/_skeleton"
import { formatDistance } from "utils/formatDistance"

export const PortfolioCard: VFC<BoxProps> = (props) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const depositTokens = cellarDataMap[id].depositTokens.list
  const depositTokenConfig = getTokenConfig(depositTokens) as Token[]
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const stakingEnd = useStakingEnd(cellarConfig)

  const { connectors } = useConnect()

  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData } = lpToken

  const lpTokenDisabled =
    !lpTokenData ||
    Number(toEther(lpTokenData?.formatted, lpTokenData?.decimals)) <=
      0

  const userStakes = useUserStakes(cellarConfig)

  const { data: netValue } = useNetValue(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)

  const bondingPeriods = bondingPeriodOptions(cellarConfig)
  const maxMultiplier = bondingPeriods
    .at(-1)
    ?.amount.replace("SOMM", "")

  const isStakingAllowed =
    stakingEnd.data?.endDate && isFuture(stakingEnd.data.endDate)

  return (
    <TransparentCard
      {...props}
      backgroundColor="surface.secondary"
      p={8}
    >
      <VStack align="stretch" spacing={8}>
        <CardStatRow
          spacing={{ sm: 4, md: 8, lg: 14 }}
          align="flex-start"
          justify="flex-start"
          direction={{ sm: "column", md: "row" }}
          wrap="wrap"
        >
          <SimpleGrid
            templateColumns={{
              sm: "max-content",
              lg: "repeat(2, max-content)",
            }}
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
            <Stack
              spacing={3}
              direction={{ sm: "row", md: "column", lg: "row" }}
            >
              {isMounted &&
                (isConnected ? (
                  <>
                    <DepositButton disabled={!isConnected} />
                    <WithdrawButton disabled={lpTokenDisabled} />
                  </>
                ) : (
                  connectors.map((c) => (
                    <ConnectButton
                      connector={c}
                      key={c.id}
                      unstyled
                    />
                  ))
                ))}
            </Stack>
          </SimpleGrid>
          <SimpleGrid
            templateColumns={{
              sm: "max-content",
              md: "repeat(2, max-content)",
            }}
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
                          false,
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
                        ? userStakes.data?.totalBondedAmount
                            .formatted || "..."
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
            {!userStakes.data?.userStakes.length &&
              stakingEnd.data?.endDate &&
              isFuture(stakingEnd.data?.endDate) && (
                <InnerCard
                  backgroundColor="surface.tertiary"
                  mt="8"
                  px="7"
                  py="7"
                >
                  <HStack>
                    <Image
                      src="/assets/icons/somm.png"
                      alt="sommelier logo"
                      boxSize={6}
                    />
                    <Heading size="16px">
                      Earn rewards when you bond{" "}
                      {apy?.potentialStakingApy}. up to{" "}
                      {maxMultiplier}
                    </Heading>
                    <Spacer />
                    <LighterSkeleton
                      isLoaded={!stakingEnd.isLoading}
                      height={4}
                    >
                      <Text fontSize="xs">
                        {stakingEnd.data?.endDate &&
                        isFuture(stakingEnd.data.endDate)
                          ? `Ends in ${formatDistanceToNow(
                              stakingEnd.data.endDate,
                              {
                                locale: { formatDistance },
                              }
                            )}`
                          : "Program Ended"}
                      </Text>
                    </LighterSkeleton>
                  </HStack>
                </InnerCard>
              )}
            {isConnected && (
              <LighterSkeleton
                h={!userStakes.isLoading ? "none" : "100px"}
                borderRadius={24}
                isLoaded={!userStakes.isLoading}
              >
                {isConnected &&
                  Boolean(userStakes.data?.userStakes.length) && (
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
