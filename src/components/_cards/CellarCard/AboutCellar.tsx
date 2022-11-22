import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { CurrentDeposits } from "components/CurrentDeposits"
import { cellarDataMap } from "data/cellarDataMap"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { useApy } from "data/hooks/useApy"
import { useCellarCap } from "data/hooks/useCellarCap"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useTvm } from "data/hooks/useTvm"
import {
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  isAPYEnabled,
  isCurrentDepositsEnabled,
  isDailyChangeEnabled,
  isIntervalGainPctEnabled,
  isTokenPriceEnabled,
  isTVMEnabled,
} from "data/uiConfig"
import { CellarCardData } from "./CellarCardDisplay"

import { UserStats } from "./UserStats"
import { CellarStats, CellarStatsLabel } from "./CellarStats"
import { useDailyChange } from "data/hooks/useDailyChange"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { PercentageText } from "components/PercentageText"
import { useIntervalGainPct } from "data/hooks/useIntervalGainPct"
import { useCountdown } from "data/hooks/useCountdown"
import { CellarKey } from "data/types"

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  const cellarConfig = cellarDataMap[data.cellarId].config
  const launchDate = cellarDataMap[data.cellarId].launchDate ?? null
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const intervalGainPct = useIntervalGainPct(cellarConfig)
  const isSteady = cellarConfig.cellar.key === CellarKey.PATACHE_LINK
  const countdown = useCountdown({
    launchDate,
  })

  const tokenPrice = useTokenPrice(cellarConfig)
  const dailyChange = useDailyChange(cellarConfig)
  return (
    <>
      {!countdown && (
        <Stack mx={2} spacing={1}>
          <Stack spacing={0}>
            {isTVMEnabled(cellarConfig) && (
              <CellarStats
                tooltip="Total value managed by Strategy"
                title="TVM"
                value={tvm?.formatted || "..."}
                size="md"
              />
            )}

            {isAPYEnabled(cellarConfig) && (
              <CellarStats
                tooltip={apy?.apyLabel || "..."}
                title="APY"
                value={apy?.expectedApy || "..."}
                isLoading={apyLoading}
              />
            )}
          </Stack>

          {isTokenPriceEnabled(cellarConfig) && (
            <CellarStats
              tooltip="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
              title="Token price"
              value={tokenPrice.data || "--"}
              isLoading={tokenPrice.isLoading}
              size="md"
            />
          )}
          {isDailyChangeEnabled(cellarConfig) && (
            <Flex alignItems="center">
              <PercentageText data={dailyChange.data} arrow />
              <CellarStatsLabel
                title="1D Change"
                tooltip="% change of current token price vs. token price yesterday"
              />
            </Flex>
          )}

          {isIntervalGainPctEnabled(cellarConfig) && (
            <Flex alignItems="center">
              <PercentageText data={intervalGainPct.data} />
              <CellarStatsLabel
                title={intervalGainPctTitleContent(cellarConfig)}
                tooltip={intervalGainPctTooltipContent(cellarConfig)}
              />
            </Flex>
          )}

          {isCurrentDepositsEnabled(cellarConfig) && (
            <CurrentDeposits
              currentDeposits={currentDeposits?.value}
              cellarCap={cellarCap?.value}
              asset={activeAsset?.symbol}
            />
          )}
        </Stack>
      )}
      <Text my={4} mx={2}>
        {data.description}
      </Text>

      {!countdown ? (
        <UserStats
          data={data}
          bg="surface.secondary"
          borderWidth={1}
          borderColor="surface.tertiary"
        />
      ) : (
        <Box padding="12px 16px" fontWeight="bold">
          Coming soon
        </Box>
      )}
    </>
  )
}
