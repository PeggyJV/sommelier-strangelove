import {
  Box,
  BoxProps,
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
      title: "24H",
      onClick: setDataHourly,
    },
    {
      title: "1W",
      onClick: setDataWeekly,
    },
    { title: "All Time", onClick: setDataAllTime },
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
            <HStack
              border="1px solid"
              borderColor="rgba(203, 198, 209, 0.25)"
              borderRadius="2rem"
              overflow="hidden"
              justify="space-around"
              spacing={0}
              marginInlineStart={{
                sm: "0rem !important",
                md: "0.5rem",
              }}
              divider={
                <StackDivider borderColor="rgba(203, 198, 209, 0.25)" />
              }
            >
              {timeButtons.map((button, i) => {
                const { title, onClick } = button
                const isSelected = title === timeline

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
                    onClick={() => {
                      setTimeline(title)
                      onClick()
                    }}
                  >
                    {title}
                  </Box>
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
