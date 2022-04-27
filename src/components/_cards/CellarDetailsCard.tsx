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
import { AaveIcon, UsdcIcon } from "components/_icons"
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
    <Card
      p={4}
      overflow="visible"
      bg="backgrounds.glassyPurple"
      borderWidth={8}
      borderRadius={16}
      borderColor="backgrounds.glassy"
    >
      <VStack spacing={4} divider={<CardDivider />} align="stretch">
        <CardStatRow align="flex-start">
          <CardStat label="strategy type" labelIcon>
            Stablecoin
          </CardStat>
          <CardStat label="strategy assets">
            <HStack spacing={-1.5}>
              <Icon
                as={FaEthereum}
                boxSize={6}
                color="violentViolet"
                bg="white"
                borderWidth={2}
                borderColor="black"
                borderRadius="full"
                p={1}
              />
              <Icon
                as={FaEthereum}
                boxSize={6}
                color="violentViolet"
                bg="sunsetOrange"
                borderWidth={2}
                borderColor="black"
                borderRadius="full"
                p={1}
              />
              <Icon
                as={FaEthereum}
                boxSize={6}
                color="violentViolet"
                bg="energyYellow"
                borderWidth={2}
                borderColor="black"
                borderRadius="full"
                p={1}
              />
            </HStack>
          </CardStat>
          <CardStat label="protocols">
            <AaveIcon
              color="violentViolet"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
            AAVE
          </CardStat>
          <CardStat label="mgmt fee">
            <UsdcIcon
              color="violentViolet"
              bg="white"
              borderRadius="full"
              p={1}
              mr={2}
            />
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
  )
}

export default CellarDetailsCard
