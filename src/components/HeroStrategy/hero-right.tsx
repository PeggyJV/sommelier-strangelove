import {
  Box,
  Heading,
  HStack,
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
import { useIntervalGainPct } from "data/hooks/useIntervalGainPct"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight: VFC<HeroStrategyRightProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const intervalGainPct = useIntervalGainPct(cellarConfig)
  const tvm = useTvm(cellarConfig)

  return (
    <Stack minW={"280px"} spacing={4}>
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
          Manage Portfolio
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
            tooltip="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
            title="Token Price"
          />
        </VStack>

        <VStack flex={1}>
          {dailyChange ? (
            <PercentageText
              data={dailyChange}
              headingSize="md"
              arrow
            />
          ) : (
            <Box>--</Box>
          )}
          <CellarStatsLabel
            tooltip="% change of current token price vs. token price yesterday"
            title="1D Change"
          />
        </VStack>

        <VStack flex={1} textAlign="center">
          {intervalGainPct.data ? (
            <PercentageText
              data={intervalGainPct.data}
              headingSize="md"
            />
          ) : (
            <Box>--</Box>
          )}
          <CellarStatsLabel
            title="1W Change vs ETH/BTC 50/50"
            tooltip="% change of token price compared to a benchmark portfolio of 50% ETH and 50% BTC"
          />
        </VStack>
      </HStack>
      <Stack pt={4} spacing={4} color="neutral.300">
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Ticker
            </Text>
          </Box>
          {content.ticker}
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Traded Assets
            </Text>
          </Box>
          {content.tradedAssets}
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Alternative to
            </Text>
          </Box>
          <Text>{content.alternativeTo}</Text>
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
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
      </Stack>
    </Stack>
  )
}
