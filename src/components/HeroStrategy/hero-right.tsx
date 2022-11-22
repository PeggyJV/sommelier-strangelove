import {
  Box,
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
import { useIntervalGainPct } from "data/hooks/useIntervalGainPct"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"
import { usePosition } from "data/hooks/usePosition"
import { tokenConfig } from "data/tokenConfig"
import { CellarKey } from "data/types"
import { useCountdown } from "data/hooks/useCountdown"

interface HeroStrategyRightProps {
  id: string
}

export const HeroStrategyRight: VFC<HeroStrategyRightProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  const buyOrSellModal = useDisclosure()
  const cellarData = cellarDataMap[id]
  const launchDate = cellarDataMap[id].launchDate ?? null
  const cellarConfig = cellarData.config
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const position = usePosition(cellarConfig)
  const intervalGainPct = useIntervalGainPct(cellarConfig)
  const tvm = useTvm(cellarConfig)
  const isSteady = cellarConfig.cellar.key === CellarKey.PATACHE_LINK
  const countdown = useCountdown({
    launchDate,
  })

  return (
    <Stack minW={"280px"} spacing={4}>
      {countdown && (
        <Box
          background="surface.tertiary"
          padding="30px 16px"
          borderRadius={16}
          borderWidth={1}
          borderColor="surface.tertiary"
          fontWeight="bold"
          textAlign="center"
          fontSize="3xl"
        >
          Coming soon
        </Box>
      )}
      {!countdown && (
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
      )}
      {!countdown && (
        <BuyOrSellModal
          uniswapLink={content.buyUrl}
          id={id}
          isOpen={buyOrSellModal.isOpen}
          onClose={buyOrSellModal.onClose}
        />
      )}
      {!countdown && (
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
      )}
      {!countdown && (
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
            <PercentageText data={dailyChange} headingSize="md" />
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
              title={
                isSteady
                  ? "1W Change vs USDC"
                  : "1W Change vs ETH/BTC 50/50"
              }
              tooltip={`% change of token price compared to a benchmark portfolio of ${
                isSteady ? "USDC" : "50% ETH and 50% BTC"
              }`}
            />
          </VStack>
        </HStack>
      )}

      <Stack pt={4} spacing={4} color="neutral.300">
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Ticker
            </Text>
          </Box>
          {content.ticker}
        </HStack>
        <HStack alignItems="start">
          <Box>
            <Text w="120px" fontWeight="semibold">
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
                    <Text>
                      {asset?.symbol} ({item.percentage.toFixed(2)}%)
                    </Text>
                  </HStack>
                )
              })
            )}
          </Stack>
        </HStack>
        <HStack>
          <Box>
            <Text w="120px" fontWeight="semibold">
              Alternative to
            </Text>
          </Box>
          <Text>{content.alternativeTo}</Text>
        </HStack>
        {!countdown && (
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
        )}
      </Stack>
    </Stack>
  )
}
