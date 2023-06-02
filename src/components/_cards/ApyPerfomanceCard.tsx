import {
  Box,
  BoxProps,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { TransparentCard } from "./TransparentCard"
import { CardHeading } from "components/_typography/CardHeading"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { ErrorCard } from "./ErrorCard"
import { Point } from "@nivo/line"
import { ChartTooltipItem } from "components/_charts/ChartTooltipItem"
import { format } from "date-fns"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useApyChart } from "data/context/apyChartContext"
import { ApyChart } from "components/_charts/ApyChart"
import { useStrategyData } from "data/hooks/useStrategyData"

export const ApyPerfomanceCard: VFC<BoxProps> = (props) => {
  const { data, timeArray, apyChange, isFetching, isError } =
    useApyChart()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { data: strategyData } = useStrategyData(
    cellarConfig.cellar.address
  )
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const [timeline, setTimeline] = useState<string>("1W")
  const [pointActive, setPointActive] = useState<Point>()

  const MobileTooltip = () => {
    if (!!pointActive && !isLarger768) {
      const { id: pointId, serieId } = pointActive
      const [_, i] = pointId.split(".")
      return (
        <Stack
          p={4}
          bg="surface.blackTransparent"
          borderWidth={1}
          borderColor="purple.base"
          borderRadius={8}
          textTransform="capitalize"
        >
          {data.series?.map((item) => {
            const name = (() => {
              if (item.id === "apy") return cellarDataMap[id]?.name
              return ""
            })()
            return (
              <ChartTooltipItem
                key={item.id}
                backgroundColor={item.color}
                name="APY since inception"
                percentage={`${String(
                  data.series?.find((s) => s.id === item.id)?.data[
                    Number(i)
                  ]?.y
                )}`}
              />
            )
          })}
          <Text color="neutral.400">
            {format(
              new Date(String(data.series?.[0].data[Number(i)].x)),
              "MMM, d, yyyy, HH:mm"
            )}
          </Text>
        </Stack>
      )
    }
    return null
  }

  if (isError) {
    return <ErrorCard />
  }

  let baseApy = strategyData?.baseApy?.formatted ?? "--"

  return (
    <Skeleton
      h={isFetching ? "450px" : "none"}
      startColor="surface.primary"
      endColor="surface.secondary"
      borderRadius={{ base: 0, sm: 24 }}
      isLoaded={!isFetching}
      overflow="none"
    >
      <TransparentCard
        px={{ base: 6, sm: 6, md: 8 }}
        py={{ base: 6, md: 8 }}
        overflow="visible"
        zIndex={1}
        {...props}
      >
        <VStack spacing={6} align="stretch">
          <Box h="20rem" mb={{ base: 12, sm: "2.2rem", md: 0 }}>
            <HStack
              justify="space-between"
              align="flex-start"
              wrap="wrap"
              rowGap={2}
            >
              <HStack spacing={8}>
                <VStack spacing={0} align="flex-start">
                  <CardHeading>APY since inception</CardHeading>
                  <HStack>
                    <Text fontSize="2.5rem" fontWeight="bold">
                      {baseApy}
                    </Text>
                  </HStack>
                  <Text color="neutral.400" fontSize="0.625rem">
                    {apyChange?.xFormatted}
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
                        isSelected
                          ? "purple.dark"
                          : "surface.tertiary"
                      }
                      backdropFilter="blur(8px)"
                      fontSize="sm"
                      fontWeight="semibold"
                      onClick={() => {
                        const eventName = `cellar.strategy-apy-perfomance-selected-${title}`
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
            <ApyChart
              timeline={timeline}
              name={cellarDataMap[id].name}
              pointActive={pointActive}
              setPointActive={setPointActive}
            />
          </Box>
          <Stack>
            <MobileTooltip />
          </Stack>
        </VStack>
      </TransparentCard>
    </Skeleton>
  )
}
