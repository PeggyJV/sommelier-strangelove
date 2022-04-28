import dynamic from "next/dynamic"
import {
  Box,
  BoxProps,
  Circle,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Serie } from "@nivo/line"
import { useState, VFC } from "react"
import { CardHeading } from "components/_typography/CardHeading"
import { CardDivider } from "components/_layout/CardDivider"
import { useNivoThemes } from "hooks/nivo"
import TransparentCard from "./TransparentCard"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

interface Props extends BoxProps {
  data?: Serie[]
}

const data: Serie[] = [
  {
    id: 1,
    data: [
      { x: "bingus", y: 5 },
      { x: "tingus", y: 15 },
      { x: "lingus", y: 5 },
      { x: "pingus", y: 25 },
      { x: "shmingus", y: 18 },
    ],
  },
  {
    id: 2,
    data: [
      { x: "bingus", y: 40 },
      { x: "shmingus", y: 5 },
    ],
  },
]

const timeButtons = ["24H", "1W", "All Time"]

export const PerformanceCard: VFC<Props> = (props) => {
  const { lineChartTheme } = useNivoThemes()
  const [timeline, setTimeline] = useState<string>("24H")

  return (
    <TransparentCard p={4} overflow="visible" {...props}>
      <VStack spacing={6} align="stretch" divider={<CardDivider />}>
        <Box h="20rem">
          <HStack justify="space-between">
            <HStack spacing={8}>
              <VStack align="flex-start">
                <HStack spacing={1}>
                  <Circle bg="deepSkyBlue.500" size={3} />
                  <CardHeading>{timeline} cellar apy</CardHeading>
                </HStack>
                <Text fontSize="xl" fontWeight="bold">
                  50%
                </Text>
              </VStack>
              <VStack align="flex-start">
                <HStack spacing={1}>
                  <Circle bg="sunsetOrange" size={3} />
                  <CardHeading>{timeline} Volume</CardHeading>
                </HStack>
                <Text fontSize="xl" fontWeight="bold">
                  12.25K USDC
                </Text>
              </VStack>
            </HStack>
            <HStack
              border="1px solid"
              borderColor="rgba(203, 198, 209, 0.25)"
              borderRadius="2rem"
              overflow="hidden"
              justify="space-around"
              spacing={0}
              divider={
                <StackDivider borderColor="rgba(203, 198, 209, 0.25)" />
              }
            >
              {timeButtons.map((button, i) => {
                const isSelected = button === timeline
                return (
                  <Box
                    flex={1}
                    px={4}
                    py={0.5}
                    key={i}
                    as="button"
                    bg={isSelected ? "rgba(203, 198, 209, 0.25)" : ""}
                    fontSize="sm"
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    onClick={() => setTimeline(button)}
                  >
                    {button}
                  </Box>
                )
              })}
            </HStack>
          </HStack>
          <LineChart
            data={data}
            colors={lineChartTheme}
            yScale={{
              type: "linear",
              max: 60,
            }}
          />
        </Box>
        <HStack justify="space-between">
          <CardHeading>12am</CardHeading>
          <CardHeading>6am</CardHeading>
          <CardHeading>12pm</CardHeading>
          <CardHeading>6pm</CardHeading>
        </HStack>
      </VStack>
    </TransparentCard>
  )
}
