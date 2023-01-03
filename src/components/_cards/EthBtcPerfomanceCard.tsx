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
import { useEthBtcChart } from "data/context/ethBtcChartContext"
import { EthBtcChart } from "components/_charts/EthBtcChart"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { PercentageText } from "components/PercentageText"
import { Legend } from "components/_charts/Legend"
import { ErrorCard } from "./ErrorCard"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { Point } from "@nivo/line"
import { ChartTooltipItem } from "components/_charts/ChartTooltipItem"
import { formatPercentage } from "utils/chartHelper"
import { format } from "date-fns"

export const EthBtcPerfomanceCard: VFC<BoxProps> = (props) => {
  const {
    data,
    timeArray,
    tokenPriceChange,
    showLine,
    setShowLine,
    isFetching,
    isError,
  } = useEthBtcChart()
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const tokenPrice = useTokenPrice(cellarConfig)
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
              if (item.id === "eth-btc-50") return "ETH 50/BTC 50"
              if (item.id === "weth") return "ETH"
              if (item.id === "wbtc") return "BTC"
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
                      {tokenPrice.data || "--"}
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
            <EthBtcChart
              timeline={timeline}
              name={cellarDataMap[id].name}
              pointActive={pointActive}
              setPointActive={setPointActive}
            />
          </Box>
          <Stack>
            <MobileTooltip />
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 2, md: 4 }}
              alignItems={{
                md: "center",
              }}
            >
              <Text fontWeight="semibold" color="#9E9DA3">
                Compare with
              </Text>
              <Legend
                color="violet.base"
                title="ETH 50/BTC 50"
                active={showLine.ethBtc50}
                onClick={() => {
                  setShowLine((prev) => ({
                    ...prev,
                    ethBtc50: !showLine.ethBtc50,
                  }))
                }}
              />
              <Legend
                color="turquoise.base"
                title="ETH"
                active={showLine.eth}
                onClick={() => {
                  setShowLine((prev) => ({
                    ...prev,
                    eth: !showLine.eth,
                  }))
                }}
              />
              <Legend
                color="orange.base"
                title="BTC"
                active={showLine.btc}
                onClick={() => {
                  setShowLine((prev) => ({
                    ...prev,
                    btc: !showLine.btc,
                  }))
                }}
              />
            </Stack>
          </Stack>
        </VStack>
      </TransparentCard>
    </Skeleton>
  )
}
