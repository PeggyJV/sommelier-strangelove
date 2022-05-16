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
} from "@chakra-ui/react"
import { CardDivider } from "components/_layout/CardDivider"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import {
  AaveIcon,
  InformationIcon,
  UsdcIcon,
} from "components/_icons"
import TransparentCard from "./TransparentCard"
import { tokenConfig } from "data/tokenConfig"
import { TokenAssets } from "components/TokenAssets"
import StrategyBreakdownCard from "./StrategyBreakdownCard"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

const supportedChains = [
  "DAI",
  "USDC",
  "USDT",
  "FEI",
  "TUSD",
  "BUSD",
  "GUSD",
]

const strategyAssets = tokenConfig.filter((token) =>
  supportedChains.includes(token.symbol)
)

const placeholderData = [
  {
    "strategy provider": 5,
    protocol: 5,
    depositors: 90,
  },
]

const CellarDetailsCard: VFC<BoxProps> = () => {
  const { barChartTheme } = useNivoThemes()
  const theme = useTheme()
  const borderColor = useBreakpointValue({
    sm: "neutral.700",
    md: "transparent",
    lg: "neutral.700",
  })

  return (
    <TransparentCard p={6} overflow="visible">
      <VStack spacing={8} align={{ sm: "unset", md: "stretch" }}>
        <CardStatRow
          justify={{ sm: "space-around", md: "flex-start" }}
          align="flex-start"
          direction={{ sm: "column", md: "row" }}
          rowGap={{ sm: 0, md: 4 }}
          wrap="wrap"
          divider={
            <CardDivider
              css={{
                "&:nth-last-child(2)": {
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
            Stablecoin
          </CardStat>
          <CardStat
            label="strategy assets"
            tooltip="Cellar will have exposure to 1 or more of these assets at any given time"
          >
            <TokenAssets tokens={strategyAssets} />
          </CardStat>
          <CardStat
            label="protocols"
            tooltip="Protocols in which Cellar operates"
          >
            <AaveIcon
              color="purple.base"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            AAVE
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
            5%
          </CardStat>
          <VStack
            width={{ sm: "100%", lg: "unset" }}
            spacing={2}
            align="stretch"
          >
            <HStack align="center">
              <Tooltip
                hasArrow
                placement="top"
                label="Cellar earned performance split"
                bg="surface.bg"
              >
                <CardHeading>performance split</CardHeading>
              </Tooltip>
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
            <Box h="4px">
              {/* @ts-ignore */}
              <BarChart
                layout="horizontal"
                colors={barChartTheme}
                borderColor={theme.colors.neutral[800]}
                borderWidth={1}
                borderRadius={2}
                keys={["strategy provider", "protocol", "depositors"]}
                data={placeholderData}
              />
            </Box>
            <HStack spacing={8}>
              {Object.entries(placeholderData[0]).map(
                ([key, value], i) => {
                  return (
                    <HStack key={i}>
                      <Circle size={4} bg={barChartTheme[i]} />
                      <Text fontSize="sm" textTransform="capitalize">
                        {value}% {key}
                      </Text>
                    </HStack>
                  )
                }
              )}
            </HStack>
          </VStack>
        </CardStatRow>
        <StrategyBreakdownCard />
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
