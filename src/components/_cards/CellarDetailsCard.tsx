import dynamic from "next/dynamic"
import {
  Box,
  BoxProps,
  Circle,
  HStack,
  Text,
  Tooltip,
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

  return (
    <TransparentCard p={4} overflow="visible">
      <VStack spacing={4} divider={<CardDivider />} align="stretch">
        <CardStatRow align="flex-start">
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
          <VStack spacing={2} align="stretch">
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
            <Box w="100%" h="4px">
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
      </VStack>
    </TransparentCard>
  )
}

export default CellarDetailsCard
