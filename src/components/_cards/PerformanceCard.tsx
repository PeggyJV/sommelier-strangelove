import {
  Box,
  BoxProps,
  Button,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { CardDivider } from "components/_layout/CardDivider"
import TransparentCard from "./TransparentCard"
import { CardStat } from "components/CardStat"
import { TVLChart } from "components/_charts/TVLChart"
import { useTVLQueries } from "hooks/urql"
import { getPrevious24Hours } from "utils/getPrevious24Hours"

const epoch = getPrevious24Hours()

export const PerformanceCard: VFC<BoxProps> = (props) => {
  const {
    fetching,
    data,
    setDataHourly,
    setDataWeekly,
    setDataAllTime,
  } = useTVLQueries(epoch)
  const [timeline, setTimeline] = useState<string>("24H")

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
            <HStack spacing={4}>
              {timeButtons.map((button, i) => {
                const { title, onClick } = button
                const isSelected = title === timeline

                return (
                  <Button
                    key={i}
                    variant="unstyled"
                    p={3}
                    py={1}
                    bg={
                      isSelected
                        ? "surface.tertiary"
                        : "surface.primary"
                    }
                    borderRadius={8}
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
