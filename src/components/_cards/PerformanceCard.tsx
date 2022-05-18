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
import { CardStat } from "components/CardStat"
import { TVLChart } from "components/_charts/TVLChart"
import { useTVLQueries } from "hooks/urql"
import { getPrevious24Hours } from "utils/calculateTime"

const epoch = getPrevious24Hours()

export const PerformanceCard: VFC<BoxProps> = (props) => {
  const {
    fetching,
    data,
    setDataHourly,
    setDataWeekly,
    setDataAllTime,
  } = useTVLQueries(epoch)
  const [timeline, setTimeline] = useState<string>("Day")

  const timeButtons = [
    {
      title: "Day",
      onClick: setDataHourly,
    },
    {
      title: "Week",
      onClick: setDataWeekly,
    },
    { title: "All", onClick: setDataAllTime },
  ]

  return (
    <TransparentCard p={4} overflow="visible" {...props}>
      <VStack spacing={6} align="stretch" divider={<CardDivider />}>
        <Box h="20rem" mb={{ sm: "2.2rem", md: 0 }}>
          <HStack justify="space-between" wrap="wrap" rowGap={2}>
            <HStack spacing={8}>
              <CardStat label="TVM" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">
                  50%
                </Text>
                <Text></Text>
              </CardStat>
            </HStack>
            <HStack spacing={2}>
              {timeButtons.map((button, i) => {
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
          <TVLChart
            data={data.series}
            fetching={fetching}
            {...data.chartProps}
          />
        </Box>
      </VStack>
    </TransparentCard>
  )
}
