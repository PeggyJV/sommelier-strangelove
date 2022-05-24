import {
  Box,
  BoxProps,
  Button,
  HStack,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { CardDivider } from "components/_layout/CardDivider"
import { TransparentCard } from "./TransparentCard"
import { TVLChart } from "components/_charts/TVLChart"
import { useTVLQueries } from "hooks/urql"
import { CardHeading } from "components/_typography/CardHeading"

export interface TvlData {
  yFormatted: string | number
  xFormatted: string | number
}

export const PerformanceCard: VFC<BoxProps> = (props) => {
  const {
    fetching,
    data,
    setDataHourly,
    setDataWeekly,
    setDataAllTime,
  } = useTVLQueries()
  const [timeline, setTimeline] = useState<string>("Day")
  const [tvl, setTvl] = useState<TvlData>()

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
            setTvl={setTvl}
            {...data.chartProps}
          />
        </Box>
      </VStack>
    </TransparentCard>
  )
}
