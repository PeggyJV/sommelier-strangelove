import {
  Box,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Point, PointSymbolProps, Serie } from "@nivo/line"
import { PercentageText } from "components/PercentageText"
import { CardBase } from "components/_cards/CardBase"
import { TransparentCard } from "components/_cards/TransparentCard"
import { format, isSameDay } from "date-fns"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import React, { FunctionComponent, useMemo, useState } from "react"
import { colors } from "theme/colors"
import { ChartPoint } from "./ChartPoint"
import { ChartPointRebalance } from "./ChartPointRelabance"
import { Legend } from "./Legend"

const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

interface TokenData {
  name: string
  date: string
  percentChange: number
  rebalancing: boolean
  tokenPrice: number
}

const tokenData: TokenData[] = [
  {
    name: "Token",
    date: "2023-04-18T00:00:00Z",
    percentChange: -0.2,
    rebalancing: false,
    tokenPrice: 100.0,
  },
  {
    name: "Token",
    date: "2023-04-19T00:00:00Z",
    percentChange: 0.1,
    rebalancing: false,
    tokenPrice: 97.65,
  },
  {
    name: "Token",
    date: "2023-04-20T00:00:00Z",
    percentChange: -0.1,
    rebalancing: true,
    tokenPrice: 102.23,
  },
  {
    name: "Token",
    date: "2023-04-21T00:00:00Z",
    percentChange: 0.2,
    rebalancing: false,
    tokenPrice: 100.34,
  },
  {
    name: "Token",
    date: "2023-04-22T00:00:00Z",
    percentChange: 0.1,
    rebalancing: false,
    tokenPrice: 101.23,
  },
  {
    name: "Token",
    date: "2023-04-23T00:00:00Z",
    percentChange: -0.1,
    rebalancing: false,
    tokenPrice: 97.99,
  },
  {
    name: "Token",
    date: "2023-04-24T00:00:00Z",
    percentChange: -0.2,
    rebalancing: false,
    tokenPrice: 99.59,
  },
]

const secondTokenData: TokenData[] = [
  {
    name: "USDC",
    date: "2023-04-18T00:00:00Z",
    percentChange: -0.1,
    rebalancing: false,
    tokenPrice: 98.5,
  },
  {
    name: "USDC",
    date: "2023-04-19T00:00:00Z",
    percentChange: 0.3,
    rebalancing: false,
    tokenPrice: 105.2,
  },
  {
    name: "USDC",
    date: "2023-04-20T00:00:00Z",
    percentChange: -0.2,
    rebalancing: false,
    tokenPrice: 100.0,
  },
  {
    name: "USDC",
    date: "2023-04-21T00:00:00Z",
    percentChange: 0.1,
    rebalancing: false,
    tokenPrice: 103.6,
  },
  {
    name: "USDC",
    date: "2023-04-22T00:00:00Z",
    percentChange: -0.3,
    rebalancing: false,
    tokenPrice: 98.7,
  },
  {
    name: "USDC",
    date: "2023-04-23T00:00:00Z",
    percentChange: 0.2,
    rebalancing: false,
    tokenPrice: 102.4,
  },
  {
    name: "USDC",
    date: "2023-04-24T00:00:00Z",
    percentChange: -0.1,
    rebalancing: false,
    tokenPrice: 97.8,
  },
]

const chartData: Serie[] = [
  {
    id: "first",
    color: "white",
    data: tokenData.map((item) => ({
      x: item.date,
      y: item.percentChange,
      price: item.tokenPrice,
      isRebalance: item.rebalancing,
      date: item.date,
      name: item.name,
    })),
  },
  {
    id: "second",
    color: "#ED4A7D",
    data: secondTokenData.map((item) => ({
      x: item.date,
      y: item.percentChange,
      price: item.tokenPrice,
      isRebalance: item.rebalancing,
      date: item.date,
      name: item.name,
    })),
  },
]

const TokenChart: React.FC = () => {
  const [pointActive, setPointActive] = useState<Point>()
  const [showLine, setShowLine] = useState<{
    [key: string]: boolean
  }>({
    first: true,
    second: false,
  })
  const filteredChartData = useMemo(() => {
    return chartData.filter((item) => showLine[item.id])
  }, [showLine])

  const onMouseMove = (
    point: Point & {
      data: { price: number; isRebalance: boolean }
    }
  ) => {
    if (point.data.isRebalance) {
      const rects = document.getElementsByTagName("rect")
      for (let i = 0; i < rects.length; i++) {
        rects[i].style.cursor = "pointer"
      }
    } else {
      const rects = document.getElementsByTagName("rect")
      for (let i = 0; i < rects.length; i++) {
        rects[i].style.cursor = "default"
      }
    }
    setPointActive(point)
  }
  const lineColors = useMemo(() => {
    return chartData.map((item) => item.color)
  }, [])
  const { chartTheme } = useNivoThemes()

  const Point: FunctionComponent<PointSymbolProps> = ({
    color,
    datum,
    size,
    borderWidth,
  }) => {
    const active = isSameDay(
      new Date(String(datum.x)),
      new Date(String(pointActive?.data.x))
    )

    const isRebalance = datum.isRebalance

    if (isRebalance) {
      return (
        <g cursor="pointer">
          <ChartPointRebalance
            fill={color}
            stroke={colors.neutral[100]}
          />
        </g>
      )
    }

    if (active) {
      return <ChartPoint fill={color} stroke={colors.neutral[100]} />
    }

    return null
  }

  return (
    <Skeleton
      startColor="surface.primary"
      endColor="surface.secondary"
      borderRadius={{ base: 0, sm: 24 }}
      isLoaded={true}
    >
      <TransparentCard
        px={{ base: 6, sm: 6, md: 8 }}
        py={{ base: 6, md: 8 }}
        overflow="visible"
      >
        <VStack spacing={6} align="stretch">
          <VStack>
            <Heading>
              ${" "}
              {(pointActive?.data as { price?: number })?.price ||
                tokenData[tokenData.length - 1].tokenPrice}{" "}
            </Heading>
            <Text as="span">
              <PercentageText
                as="span"
                display="inline-flex"
                alignItems="baseline"
                data={
                  (pointActive?.data.y as number) ||
                  tokenData[tokenData.length - 1].percentChange
                }
                arrowT2
                fontWeight={600}
              />
              <Text as="span" color="neutral.400" fontWeight={500}>
                {" "}
                Past Week
              </Text>
            </Text>
          </VStack>
          <Box height={400}>
            <LineChart
              onClick={(point) => {
                console.log("point", point)
              }}
              animate={false}
              colors={lineColors}
              crosshairType="x"
              onMouseMove={(point) => onMouseMove(point as any)}
              onMouseLeave={() => {
                setPointActive(undefined)
              }}
              data={filteredChartData || []}
              margin={{ bottom: 110, left: 100, right: 100, top: 50 }}
              yScale={{
                type: "linear",
                stacked: false,
                max: "auto",
                min: "auto",
              }}
              axisBottom={{
                renderTick: (tick) => {
                  return (
                    <g
                      transform={`translate(${tick.x},${
                        tick.y + 20
                      })`}
                    >
                      <text
                        x={0}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fill: "white",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {format(
                          new Date(String(tick.value)),
                          "MMM, d"
                        )}
                      </text>
                    </g>
                  )
                },
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              theme={chartTheme}
              pointSize={16}
              pointBorderWidth={2}
              pointLabelYOffset={-12}
              fill={[{ match: "*", id: "gradientA" }]}
              enablePoints
              tooltip={(props) => {
                const date = (pointActive?.data as { date?: string })
                  ?.date
                if (!date) {
                  return null
                }
                const formattedDate = format(
                  new Date(String(date)),
                  "MMM d, ''yy, h:mm a"
                )
                return (
                  <Text
                    marginLeft={props.point.x === 0 ? 150 : 0}
                    mb={4}
                    color="#9E9DA3"
                  >
                    {formattedDate}
                  </Text>
                )
              }}
              pointSymbol={Point}
              xFormat={(value) => format(new Date(value), "MMM, d")}
            />
          </Box>
          {pointActive && (
            <CardBase
              left={pointActive?.x + 20}
              position="absolute"
              boxShadow="0px 0px 34px rgba(0,0,0,0.55)"
              bgColor="neutral.900"
              maxW="261px"
              minW="260px"
              maxH="104px"
              bottom={20}
            >
              <Box w="100%">
                {filteredChartData?.map((item) => {
                  const index = pointActive.id.split(".")[1]
                  const itemData = item.data[parseInt(index)]
                  return (
                    <Box key={item.id}>
                      <HStack
                        justifyContent="space-between"
                        w="100%"
                        color="#D9D7E0"
                      >
                        {filteredChartData.length > 1 && (
                          <Box
                            boxSize="8px"
                            backgroundColor={item.color}
                            borderRadius={2}
                          />
                        )}
                        <HStack>
                          <Text>{itemData.name}: </Text>
                          <Text>{itemData.price}</Text>
                        </HStack>
                        <Text textAlign="right">{itemData.y} %</Text>
                      </HStack>
                    </Box>
                  )
                })}
              </Box>
            </CardBase>
          )}
        </VStack>
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
            title="USDC"
            active={showLine.second}
            onClick={() => {
              setShowLine((prev) => ({
                ...prev,
                second: !prev.second,
              }))
            }}
          />
        </Stack>
      </TransparentCard>
    </Skeleton>
  )
}
export { TokenChart }
