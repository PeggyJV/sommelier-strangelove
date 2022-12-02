import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
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
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useDailyChange } from "data/hooks/useDailyChange"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"
import { PercentageText } from "components/PercentageText"
import { CellarStatsLabel } from "components/_cards/CellarCard/CellarStats"
import { useTvm } from "data/hooks/useTvm"
import { useIntervalGain } from "data/hooks/useIntervalGain"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"
import { usePosition } from "data/hooks/usePosition"
import { tokenConfig } from "data/tokenConfig"
import { isComingSoon } from "utils/isComingSoon"
import {
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  intervalGainTimeline,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { CountDown } from "./count-down"
import { formatDistanceToNow } from "date-fns"
import { useApy } from "data/hooks/useApy"
import { useStakingEnd } from "data/hooks/useStakingEnd"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight: VFC<HeroStrategyRightProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const launchDate = cellarDataMap[id].launchDate
  const cellarConfig = cellarData.config
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const { data: stakingEnd } = useStakingEnd(cellarConfig)
  const position = usePosition(cellarConfig)
  const intervalGainPct = useIntervalGain({
    config: cellarConfig,
    timeline: intervalGainTimeline(cellarConfig),
  })
  const tvm = useTvm(cellarConfig)
  const countdown = isComingSoon(launchDate)

  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const potentialStakingApy = apyLoading
    ? "-"
    : apy?.potentialStakingApy

  return (
    <Stack minW={"380px"} spacing={4}>
      {countdown && launchDate ? (
        <CountDown launchDate={launchDate} />
      ) : (
        <>
          <BaseButton
            w="full"
            h="50px"
            onClick={() => {
              analytics.track("strategy.buy-sell", {
                strategyCard: cellarData.name,
                landingType: landingType(),
              })
              buyOrSellModal.onOpen()
            }}
          >
            Buy / Sell
          </BaseButton>
          <BuyOrSellModal
            uniswapLink={content.buyUrl}
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
            style={{ textDecoration: "none" }}
          >
            <SecondaryButton w="full" h="50px">
              View Details
            </SecondaryButton>
          </Link>
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

            <VStack flex={1}>
              <PercentageText data={dailyChange} headingSize="md" />
              <CellarStatsLabel
                tooltip="% change of current token price vs. token price yesterday"
                title="1D Change"
              />
            </VStack>

            <VStack flex={1} textAlign="center">
              <PercentageText
                data={intervalGainPct.data}
                headingSize="md"
              />

              <CellarStatsLabel
                title={intervalGainPctTitleContent(cellarConfig)}
                tooltip={intervalGainPctTooltipContent(cellarConfig)}
              />
            </VStack>
          </HStack>
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
            {position.isLoading ? (
              <Spinner />
            ) : (
              position.data?.map((item) => {
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
              {tvm.isLoading ? (
                <Spinner />
              ) : (
                tvm.data?.formatted || "--"
              )}
            </Text>
          </HStack>
        )}

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
              {!stakingEnd?.ended
                ? stakingEnd?.endDate &&
                  `${formatDistanceToNow(stakingEnd?.endDate)} left`
                : "Program Ended"}
            </Text>
          </Flex>
        </HStack>
      </Stack>
    </Stack>
  )
}
