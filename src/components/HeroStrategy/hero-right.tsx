import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { BuyOrSellModal } from "components/_modals/BuyOrSellModal"
import { cellarDataMap } from "data/cellarDataMap"
import { VFC } from "react"
import { PercentageText } from "components/PercentageText"
import { CellarStatsLabel } from "components/_cards/CellarCard/CellarStats"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"
import { tokenConfig } from "data/tokenConfig"
import { isComingSoon } from "utils/isComingSoon"
import {
  apyHoverLabel,
  apyLabel,
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  intervalGainTimeline,
  isDailyChangeEnabled,
  isIntervalGainPctEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { CountDown } from "./count-down"
import { formatDistanceToNow, isFuture } from "date-fns"
import { NotifyModal } from "components/_modals/NotifyModal"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { CellarType } from "data/types"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useStrategyData } from "data/hooks/useStrategyData"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight: VFC<HeroStrategyRightProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const notifyModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const launchDate = cellarDataMap[id].launchDate
  const cellarConfig = cellarData.config
  const { data, isLoading } = useStrategyData(
    cellarData.config.cellar.address
  )
  const {
    tokenPrice,
    changes,
    stakingEnd,
    positionDistribution,
    tvm,
    rewardsApy,
    baseApy,
  } = data || {}
  const dailyChange = changes?.daily
  const router = useRouter()

  const intervalGainPct =
    changes?.[intervalGainTimeline(cellarConfig)]

  const countdown = isComingSoon(launchDate)

  const potentialStakingApy = isLoading
    ? "-"
    : rewardsApy?.formatted || "-"

  const handleBuyOrSell = () => {
    if (Number(content.exchange?.length) > 1) {
      analytics.track("strategy.buy-sell", {
        strategyCard: cellarData.name,
        landingType: landingType(),
      })
      buyOrSellModal.onOpen()
    } else {
      analytics.track("strategy.buy-sell", {
        strategyCard: cellarData.name,
        landingType: landingType(),
      })
      router.push({
        pathname: `/strategies/${id}/manage`,
      })
    }
  }

  const isYieldStrategies =
    cellarData.cellarType === CellarType.yieldStrategies
  const isAutomatedPortfolio =
    cellarData.cellarType === CellarType.automatedPortfolio

  return (
    <Stack minW={{ base: "100%", md: "380px" }} spacing={4}>
      {countdown && launchDate ? (
        <>
          <CountDown launchDate={launchDate} />
          <BaseButton
            w="full"
            h="60px"
            onClick={() => {
              analytics.track("strategy.notify-me", {
                strategyCard: cellarData.name,
                landingType: landingType(),
              })
              notifyModal.onOpen()
            }}
          >
            Notify me
          </BaseButton>
          <NotifyModal
            isOpen={notifyModal.isOpen}
            onClose={notifyModal.onClose}
          />
        </>
      ) : (
        <>
          <BaseButton w="full" h="50px" onClick={handleBuyOrSell}>
            Buy / Sell
          </BaseButton>
          <BuyOrSellModal
            exchange={content.exchange}
            id={id}
            isOpen={buyOrSellModal.isOpen}
            onClose={buyOrSellModal.onClose}
          />
          <Link
            href={`/strategies/${id}/manage`}
            onClick={() => {
              analytics.track("strategy.manage-portfolio", {
                strategyCard: cellarData.name,
                landingType: landingType(),
              })
            }}
            textDecoration="none"
          >
            <SecondaryButton w="full" h="50px">
              View Details
            </SecondaryButton>
          </Link>
          {isYieldStrategies && (
            <HStack
              pt={4}
              justifyContent="space-around"
              alignItems="start"
              divider={<StackDivider borderColor="purple.dark" />}
            >
              <VStack flex={1}>
                <Heading size="md">{tvm?.formatted || "--"}</Heading>
                <CellarStatsLabel
                  tooltip="Total value locked"
                  title="TVL"
                />
              </VStack>
              <VStack flex={1} textAlign="center">
                <Heading size="md">
                  {baseApy?.formatted || "--"}
                </Heading>
                <CellarStatsLabel
                  tooltip={apyHoverLabel(cellarConfig) || ""}
                  title={apyLabel(cellarConfig)}
                />
              </VStack>
              <VStack flex={1}>
                <Heading size="md" color="lime.base">
                  {rewardsApy?.formatted || "--"}
                </Heading>
                <CellarStatsLabel title={"Rewards APY"} />
              </VStack>
            </HStack>
          )}
          {isAutomatedPortfolio && (
            <HStack
              pt={4}
              justifyContent="space-around"
              alignItems="start"
              divider={<StackDivider borderColor="purple.dark" />}
            >
              <VStack flex={1}>
                <Heading size="md">{tokenPrice || "--"}</Heading>
                <CellarStatsLabel
                  tooltip={tokenPriceTooltipContent(cellarConfig)}
                  title="Token Price"
                />
              </VStack>
              {isDailyChangeEnabled(cellarConfig) && (
                <VStack flex={1}>
                  <PercentageText
                    data={dailyChange}
                    headingSize="md"
                  />
                  <CellarStatsLabel
                    tooltip="% change of current token price vs. token price yesterday"
                    title="1D Change"
                  />
                </VStack>
              )}
              {isIntervalGainPctEnabled(cellarConfig) && (
                <VStack flex={1} textAlign="center">
                  <PercentageText
                    data={intervalGainPct}
                    headingSize="md"
                  />

                  <CellarStatsLabel
                    title={intervalGainPctTitleContent(cellarConfig)}
                    tooltip={intervalGainPctTooltipContent(
                      cellarConfig
                    )}
                  />
                </VStack>
              )}
            </HStack>
          )}
        </>
      )}

      <Stack pt={4} spacing={6} color="neutral.300">
        <HStack>
          <Box>
            <Text w="150px" fontWeight="semibold">
              Ticker
            </Text>
          </Box>
          {content.ticker}
        </HStack>
        <HStack alignItems="start">
          <Box>
            <Text w="150px" fontWeight="semibold">
              Traded Assets
            </Text>
          </Box>
          <Stack direction="column">
            {isLoading ? (
              <Spinner />
            ) : positionDistribution?.length !== 0 ? (
              positionDistribution?.map((item) => {
                const asset = tokenConfig.find(
                  (v) => v.address === item.address
                )
                return (
                  <HStack key={item.address}>
                    <Image
                      alt={asset?.alt}
                      src={asset?.src}
                      boxSize={8}
                    />
                    {!countdown ? (
                      <Text>
                        {asset?.symbol} ({item.percentage.toFixed(2)}
                        %)
                      </Text>
                    ) : (
                      <Text>{asset?.symbol}</Text>
                    )}
                  </HStack>
                )
              })
            ) : (
              content.tradedAssets?.map((item) => {
                const asset = tokenConfig.find(
                  (v) => v.symbol === item
                )
                return (
                  <HStack key={item}>
                    <Image
                      alt={asset?.alt}
                      src={asset?.src}
                      boxSize={8}
                    />
                    <Text>{asset?.symbol}</Text>
                  </HStack>
                )
              })
            )}
          </Stack>
        </HStack>
        <HStack>
          <Box>
            <Text w="150px" fontWeight="semibold">
              Alternative to
            </Text>
          </Box>
          <Text>{content.alternativeTo}</Text>
        </HStack>
        {!countdown && (
          <HStack>
            <Box>
              <Text w="150px" fontWeight="semibold">
                Total assets
              </Text>
            </Box>
            <Text>
              {isLoading ? <Spinner /> : tvm?.formatted || "--"}
            </Text>
          </HStack>
        )}
        {!countdown &&
          stakingEnd?.endDate &&
          isFuture(stakingEnd?.endDate) && (
            <HStack>
              <Box>
                <Text w="150px" fontWeight="semibold">
                  Rewards
                </Text>
              </Box>
              <Flex wrap="wrap" gap={2}>
                <Text>{`Expected Rewards APY ${potentialStakingApy}`}</Text>
                <Text
                  py={1}
                  px={2}
                  borderRadius={28}
                  bgColor="purple.base"
                  fontSize="xs"
                  fontFamily={"monospace"}
                >
                  {stakingEnd?.endDate
                    ? isFuture(stakingEnd?.endDate) &&
                      `${formatDistanceToNow(
                        stakingEnd?.endDate
                      )} left`
                    : "Program Ended"}
                </Text>
              </Flex>
            </HStack>
          )}
      </Stack>
    </Stack>
  )
}
