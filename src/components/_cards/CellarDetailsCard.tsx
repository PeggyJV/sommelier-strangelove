import dynamic from "next/dynamic"
import {
  BoxProps,
  Circle,
  HStack,
  Text,
  Tooltip,
  useTheme,
  VStack,
  Image,
  SimpleGrid,
  Stack,
  Spinner,
} from "@chakra-ui/react"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { InformationIcon } from "components/_icons"
import { TransparentCard } from "./TransparentCard"
import { tokenConfig } from "data/tokenConfig"
import { StrategyBreakdownCard } from "./StrategyBreakdownCard"
import { StrategyProvider } from "components/StrategyProvider"
import { CellarDataMap } from "data/types"
import { protocolsImage } from "utils/protocolsImagePath"
import {
  isAssetDistributionEnabled,
  isTokenAssets,
} from "data/uiConfig"
import { TokenAssets } from "components/TokenAssets"
import { PositionDistribution } from "components/TokenAssets/PositionDistribution"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { isArray } from "lodash"
import { useStrategyData } from "data/hooks/useStrategyData"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

interface CellarDetailsProps extends BoxProps {
  cellarId: string
  cellarDataMap: CellarDataMap
}

export interface ProtocolDataType {
  title: string
  icon: string
}
const CellarDetailsCard: VFC<CellarDetailsProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { barChartTheme } = useNivoThemes()
  const isLarger400 = useBetterMediaQuery("(min-width: 400px)")
  const theme = useTheme()
  const {
    protocols,
    strategyType,
    strategyTypeTooltip,
    managementFee,
    managementFeeTooltip,
    strategyAssets,
    performanceSplit,
    strategyProvider,
  } = cellarDataMap[cellarId]
  const cellarStrategyAssets = tokenConfig.filter((token) =>
    strategyAssets?.includes(token.symbol)
  )
  const performanceSplitKeys = Object.keys(performanceSplit)
  const cellarConfig = cellarDataMap[cellarId].config

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address
  )
  const positionDistribution = strategyData?.positionDistribution
  const tvm = strategyData?.tvm
  const activeAsset = strategyData?.activeAsset

  const isManyProtocols = isArray(protocols)
  const protocolData = isManyProtocols
    ? protocols.map((v) => {
        return {
          title: v,
          icon: protocolsImage[v],
        }
      })
    : {
        title: protocols,
        icon: protocolsImage[protocols],
      }

  const gridColumn = isManyProtocols
    ? { base: isLarger400 ? 2 : 1, sm: 2, md: 2, lg: 2 }
    : { base: isLarger400 ? 2 : 1, sm: 2, md: 3, lg: 4 }

  return (
    <TransparentCard
      px={{ base: 0, sm: 6, md: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="visible"
    >
      <VStack
        spacing={{ base: 6, sm: 6, md: 8 }}
        align={{ sm: "unset", md: "stretch" }}
      >
        <SimpleGrid
          columns={gridColumn}
          spacing={4}
          px={{ base: 6, sm: 0 }}
        >
          <CardStat
            label="strategy type"
            flex={0}
            tooltip={strategyTypeTooltip}
          >
            {strategyType}
          </CardStat>
          {strategyProvider && (
            <StrategyProvider strategyProvider={strategyProvider} />
          )}
          <CardStat
            label="protocols"
            flex={0}
            tooltip="Protocols in which Strategy operates"
            pr={{ sm: 2, lg: 8 }}
          >
            {isManyProtocols ? (
              <Stack
                spacing={3}
                direction={{ base: "column", lg: "row" }}
              >
                {(protocolData as ProtocolDataType[]).map((v, i) => (
                  <HStack key={i} spacing={2}>
                    <Image
                      src={v.icon}
                      alt="Protocol Icon"
                      boxSize={6}
                    />
                    <Text>{v.title}</Text>
                  </HStack>
                ))}
              </Stack>
            ) : (
              <>
                <Image
                  src={
                    (protocolData as ProtocolDataType).icon as string
                  }
                  alt="Protocol Icon"
                  boxSize={6}
                  mr={2}
                />
                {(protocolData as ProtocolDataType).title}
              </>
            )}
          </CardStat>
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={4}
            justifyContent={
              isManyProtocols ? "normal" : "space-between"
            }
          >
            <CardStat
              label="Total Fees"
              flex={0}
              tooltip={
                managementFeeTooltip || "Platform management fee"
              }
            >
              {managementFee}
            </CardStat>
            <CardStat label="Deposit and Exit Fees" flex={0}>
              0.0%
            </CardStat>
          </Stack>

          <CardStat label="TVL" flex={0} tooltip="Total value locked">
            {tvm?.formatted || "..."}
          </CardStat>
          <CardStat
            label="strategy assets"
            tooltip="Strategy will have exposure to 1 or more of these assets at any given time"
          >
            <HStack>
              {isTokenAssets(cellarConfig) && (
                <TokenAssets
                  tokens={cellarStrategyAssets}
                  activeAsset={activeAsset?.address || ""}
                  displaySymbol
                />
              )}

              {isAssetDistributionEnabled(cellarConfig) &&
              isLoading ? (
                <Spinner />
              ) : (
                positionDistribution?.map((item) => {
                  const asset = tokenConfig.find(
                    (v) => v.address === item.address
                  )
                  return (
                    <PositionDistribution
                      key={item.address}
                      address={item.address}
                      percentage={`${item.percentage.toFixed(2)}%`}
                      src={asset?.src}
                    />
                  )
                })
              )}
            </HStack>
          </CardStat>
          <VStack
            width="lg"
            spacing={2}
            align="stretch"
            maxW={{ base: "100%", md: "150%" }}
          >
            <HStack spacing={1} align="center">
              <Tooltip
                hasArrow
                placement="top"
                label="Strategy earned performance split"
                bg="surface.bg"
                color="neutral.300"
              >
                <HStack align="center" spacing={1}>
                  <CardHeading>performance split</CardHeading>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
            </HStack>
            <Stack h="4px">
              {/* @ts-ignore */}
              <BarChart
                layout="horizontal"
                colors={barChartTheme}
                borderColor={theme.colors.neutral[800]}
                borderWidth={1}
                borderRadius={2}
                keys={performanceSplitKeys}
                data={[performanceSplit]}
              />
            </Stack>
            <HStack spacing={8}>
              {Object.entries(performanceSplit).map(
                ([key, value], i) => {
                  return (
                    <HStack key={i} spacing={1}>
                      <Circle size={2} bg={barChartTheme[i]} />
                      <Text
                        fontSize="0.625rem"
                        textTransform="capitalize"
                      >
                        {value}% {key}
                      </Text>
                    </HStack>
                  )
                }
              )}
            </HStack>
          </VStack>
        </SimpleGrid>
        <StrategyBreakdownCard
          cellarDataMap={cellarDataMap}
          cellarId={cellarId}
        />
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
