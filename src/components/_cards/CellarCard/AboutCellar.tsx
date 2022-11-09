import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { CurrentDeposits } from "components/CurrentDeposits"
import { cellarDataMap } from "data/cellarDataMap"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { useApy } from "data/hooks/useApy"
import { useCellarCap } from "data/hooks/useCellarCap"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useTvm } from "data/hooks/useTvm"
import {
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

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  const cellarConfig = cellarDataMap[data.cellarId].config
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const intervalGainPct = useIntervalGainPct(cellarConfig)

  const tokenPrice = useTokenPrice(cellarConfig)
  const dailyChange = useDailyChange(cellarConfig)
  return (
    <>
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
            {dailyChange.data ? (
              <PercentageText data={dailyChange.data} arrow />
            ) : (
              <Box>--</Box>
            )}
            <CellarStatsLabel
              title="1D Change"
              tooltip="% change of current token price vs. token price yesterday"
            />
          </Flex>
        )}

        {isIntervalGainPctEnabled(cellarConfig) && (
          <Flex alignItems="center">
            {intervalGainPct.data ? (
              <PercentageText data={intervalGainPct.data} />
            ) : (
              <Box>--</Box>
            )}
            <CellarStatsLabel
              title="1W Change vs ETH/BTC 50/50"
              tooltip="% change of token price compared to a benchmark portfolio of 50% ETH and 50% BTC"
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
      <Text my={4} mx={2}>
        {data.description}
      </Text>
      <UserStats
        data={data}
        bg="surface.secondary"
        borderWidth={1}
        borderColor="surface.tertiary"
      />
    </>
  )
}
