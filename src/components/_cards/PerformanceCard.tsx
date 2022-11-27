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
import { analytics } from "utils/analytics"
import { usePerformanceChartByAddress } from "data/context/performanceChartByAddressContext"

export const PerformanceCard: VFC<BoxProps> = (props) => {
  const { timeArray, tvl } = usePerformanceChartByAddress()
  const [timeline, setTimeline] = useState<string>("Day")

  return (
    <TransparentCard
      px={{ base: 0, sm: 6, md: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="visible"
      {...props}
    >
      {/* TODO: Add Error, loading state */}
      <VStack spacing={6} align="stretch" divider={<CardDivider />}>
        <Box h="20rem" mb={{ sm: "2.2rem", md: 0 }}>
          <HStack
            justify="space-between"
            align="flex-start"
            wrap="wrap"
            rowGap={2}
            px={{ base: 6, sm: 0 }}
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
                      const eventName = `cellar.tvm-selected-${title}`
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
          <Box h="90%">
            <TVLChart />
          </Box>
        </Box>
      </VStack>
    </TransparentCard>
  )
}
