import {
  Box,
  BoxProps,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { CardDivider } from "components/_layout/CardDivider"
import { TransparentCard } from "./TransparentCard"
import { TVLChart } from "components/_charts/TVLChart"
import { CardHeading } from "components/_typography/CardHeading"
import { usePerformanceChart } from "context/performanceChartContext"
import { analytics } from "utils/analytics"

export const PerformanceCard: VFC<BoxProps> = (props) => {
  const { timeArray, tvl } = usePerformanceChart()
  const [timeline, setTimeline] = useState<string>("Day")

  return (
    <TransparentCard p={8} overflow="visible" {...props}>
      <VStack spacing={6} align="stretch" divider={<CardDivider />}>
        <Box h="20rem" mb={{ sm: "2.2rem", md: 0 }}>
          <HStack
            justify="space-between"
            align="flex-start"
            wrap="wrap"
            rowGap={2}
          >
            <HStack spacing={8}>
              <VStack spacing={0} align="flex-start">
                <CardHeading>TVM</CardHeading>
                <Text fontSize="2.5rem" fontWeight="bold">
                  ${tvl?.yFormatted}
                </Text>
                <Text color="neutral.400" fontSize="0.625rem">
                  {tvl?.xFormatted}
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={2}>
              {timeArray.map((button, i) => {
                const { title, onClick } = button
                const isSelected = title === timeline

                return (
                  <Button
                    key={i}
                    variant="unstyled"
                    p={4}
                    py={1}
                    color={isSelected ? "white" : "neutral.400"}
                    bg={
                      isSelected
                        ? "surface.tertiary"
                        : "surface.secondary"
                    }
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={
                      isSelected ? "purple.dark" : "surface.tertiary"
                    }
                    backdropFilter="blur(8px)"
                    fontSize="sm"
                    fontWeight="semibold"
                    onClick={() => {
                      const eventName = `cellar.tvm-${title}`
                      analytics.safeTrack(eventName.toLowerCase())
                      setTimeline(title)
                      onClick()
                    }}
                  >
                    {title}
                  </Button>
                )
              })}
            </HStack>
          </HStack>
          <TVLChart />
        </Box>
      </VStack>
    </TransparentCard>
  )
}
