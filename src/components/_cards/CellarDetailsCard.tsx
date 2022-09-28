import dynamic from "next/dynamic"
import {
  Box,
  BoxProps,
  Circle,
  HStack,
  Text,
  Tooltip,
  useBreakpointValue,
  useTheme,
  VStack,
  Image,
} from "@chakra-ui/react"
import { CardDivider } from "components/_layout/CardDivider"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { InformationIcon, UsdcIcon } from "components/_icons"
import { TransparentCard } from "./TransparentCard"
import { tokenConfig } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import { StrategyBreakdownCard } from "./StrategyBreakdownCard"
import { StrategyProvider } from "components/StrategyProvider"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { CellarDataMap } from "data/types"
import { protocolsImage } from "utils/protocolsImagePath"
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

const CellarDetailsCard: VFC<CellarDetailsProps> = ({
  cellarId,
  cellarDataMap,
}) => {
  const { barChartTheme } = useNivoThemes()
  const theme = useTheme()
  const borderColor = useBreakpointValue({
    sm: "purple.dark",
    md: "transparent",
    lg: "purple.dark",
  })
  const {
    protocols,
    strategyType,
    managementFee,
    strategyAssets,
    performanceSplit,
    strategyProvider,
  } = cellarDataMap[cellarId]
  const cellarStrategyAssets = tokenConfig.filter((token) =>
    strategyAssets?.includes(token.symbol)
  )
  const cellarConfig = cellarDataMap[cellarId].config
  const { data: activeAsset } = useActiveAsset(cellarConfig)

  // Unsure why this was necessary? Nivo acts strangely when there are fewer than three args in an index. Could be refined later.
  const moveColors = (colorTheme: string[]): string[] => {
    const lastColor = colorTheme.slice(-1)
    const otherColors = colorTheme.slice(0, -1)
    return [...lastColor, ...otherColors]
  }

  const colors = moveColors(barChartTheme)

  const protocolIcon = protocolsImage[protocols]

  return (
    <TransparentCard p={8} overflow="visible">
      <VStack spacing={8} align={{ sm: "unset", md: "stretch" }}>
        <CardStatRow
          justify={{ sm: "space-around", md: "flex-start" }}
          align="flex-start"
          direction={{ sm: "column", md: "row" }}
          rowGap={{ sm: 0, md: 4 }}
          wrap={{ sm: "wrap", lg: "nowrap" }}
          divider={
            <CardDivider
              css={{
                "&:nth-last-of-type(2)": {
                  borderColor,
                },
              }}
            />
          }
        >
          <CardStat
            label="strategy type"
            tooltip="Cellar uses Stablecoin lending"
          >
            {strategyType}
          </CardStat>
          <CardStat
            label="protocols"
            tooltip="Protocols in which Cellar operates"
          >
            <Image
              src={protocolIcon}
              alt="aave logo"
              boxSize={6}
              mr={2}
            />
            {protocols}
          </CardStat>
          <CardStat
            label="mgmt fee"
            tooltip="Platform management fee"
          >
            <UsdcIcon
              color="purple.base"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            {managementFee}
          </CardStat>
          <CardStat
            label="strategy assets"
            tooltip="Cellar will have exposure to 1 or more of these assets at any given time"
          >
            <TokenAssets
              tokens={cellarStrategyAssets}
              activeAsset={activeAsset?.address || ""}
              displaySymbol
            />
          </CardStat>
          <VStack
            width={{ sm: "100%", lg: "unset" }}
            spacing={2}
            align="stretch"
          >
            <HStack spacing={1} align="center">
              <Tooltip
                hasArrow
                placement="top"
                label="Cellar earned performance split"
                bg="surface.bg"
                color="neutral.300"
              >
                <HStack align="center" spacing={1}>
                  <CardHeading>performance split</CardHeading>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
            </HStack>
            <Box h="4px" maxW={{ lg: 318 }}>
              {/* @ts-ignore */}
              <BarChart
                layout="horizontal"
                colors={barChartTheme}
                borderColor={theme.colors.neutral[800]}
                borderWidth={1}
                borderRadius={2}
                keys={["depositors", "protocol", "strategy provider"]}
                data={[performanceSplit]}
              />
            </Box>
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
        </CardStatRow>
        <StrategyBreakdownCard
          cellarDataMap={cellarDataMap}
          cellarId={cellarId}
        />
        {strategyProvider && (
          <StrategyProvider strategyProvider={strategyProvider} />
        )}
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
