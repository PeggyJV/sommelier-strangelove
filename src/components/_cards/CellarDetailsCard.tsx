import dynamic from "next/dynamic"
import {
  Box,
  BoxProps,
  Circle,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "components/_layout/CardDivider"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { Card } from "./Card"
import { useNivoThemes } from "hooks/nivo"
import { CardStat } from "components/CardStat"
import { FaEthereum } from "react-icons/fa"
import { CardStatRow } from "components/CardStatRow"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

const placeholderData = [
  {
    platform: 5,
    protocol: 5,
    depositors: 90,
  },
]

const CellarDetailsCard: VFC<BoxProps> = () => {
  const { barChartTheme } = useNivoThemes()

  return (
    <Card p={2} bg="backgrounds.glassy" overflow="visible">
      <Card p={4} bg="backgrounds.black" overflow="visible">
        <VStack spacing={4} divider={<CardDivider />} align="stretch">
          <CardStatRow>
            <CardStat label="strategy type" labelIcon>
              Stablecoin
            </CardStat>
            <CardStat
              label="strategy assets"
              labelIcon
              statIcon={FaEthereum}
            />
            <CardStat
              label="protocols"
              labelIcon
              statIcon={FaEthereum}
            >
              AAVE
            </CardStat>
            <CardStat label="mgmt fee" labelIcon>
              5%
            </CardStat>
            <VStack spacing={2} align="stretch">
              <CardHeading>
                performance split <Icon boxSize={3} />
              </CardHeading>
              <Box w="100%" h="6px">
                {/* @ts-ignore */}
                <BarChart
                  layout="horizontal"
                  colors={barChartTheme}
                  keys={["platform", "protocol", "depositors"]}
                  data={placeholderData}
                />
              </Box>
              <HStack spacing={8}>
                {Object.entries(placeholderData[0]).map(
                  ([key, value], i) => {
                    return (
                      <HStack key={i}>
                        <Circle size={4} bg={barChartTheme[i]} />
                        <Text fontSize="sm">
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
      </Card>
    </Card>
  )
}

export default CellarDetailsCard
