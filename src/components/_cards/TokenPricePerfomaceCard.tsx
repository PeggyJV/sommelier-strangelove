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
import { Point } from "@nivo/line"
import { PercentageText } from "components/PercentageText"
import { ChartTooltipItem } from "components/_charts/ChartTooltipItem"
import { TokenPriceChart } from "components/_charts/TokenPriceChart"
import { CardHeading } from "components/_typography/CardHeading"
import { cellarDataMap } from "data/cellarDataMap"
import { useTokenPriceChart } from "data/context/tokenPriceChartContext"
import { useStrategyData } from "data/hooks/useStrategyData"
import { format } from "date-fns"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useRouter } from "next/router"
import { useState, VFC } from "react"
import { analytics } from "utils/analytics"
import { formatPercentage } from "utils/chartHelper"
import { ErrorCard } from "./ErrorCard"
import { TransparentCard } from "./TransparentCard"

export const TokenPricePerfomanceCard: VFC<BoxProps> = (props) => {
  const { data, timeArray, tokenPriceChange, isFetching, isError } =
    useTokenPriceChart()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const { data: strategyData } = useStrategyData(
    cellarConfig.cellar.address
  )
  const tokenPrice = strategyData?.tokenPrice
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
              if (item.id === "token-price")
                return cellarDataMap[id]?.name
              if (item.id === "usdc") return "USDC"
              return ""
            })()
            return (
              <ChartTooltipItem
                key={item.id}
                backgroundColor={item.color}
                name={name}
                value={`$${
                  data.series?.find((s) => s.id === item.id)?.data[
                    Number(i)
                  ]?.value
                }`}
                percentage={`${formatPercentage(
                  String(
                    data.series?.find((s) => s.id === item.id)?.data[
                      Number(i)
                    ]?.y
                  )
                )}%`}
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
  return (
    <Skeleton
      h={isFetching ? "450px" : "none"}
      startColor="surface.primary"
      endColor="surface.secondary"
      borderRadius={{ base: 0, sm: 24 }}
      isLoaded={!isFetching}
    >
      <TransparentCard
        px={{ base: 6, sm: 6, md: 8 }}
        py={{ base: 6, md: 8 }}
        overflow="visible"
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
                  <CardHeading>Token Price</CardHeading>
                  <HStack>
                    <Text fontSize="2.5rem" fontWeight="bold">
                      {tokenPrice || "--"}
                    </Text>
                    <PercentageText
                      data={Number(tokenPriceChange?.yFormatted)}
                      arrow
                    />
                  </HStack>
                  <Text color="neutral.400" fontSize="0.625rem">
                    {tokenPriceChange?.xFormatted}
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
                        const eventName = `cellar.strategy-perfomance-selected-${title}`
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
            <TokenPriceChart
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
