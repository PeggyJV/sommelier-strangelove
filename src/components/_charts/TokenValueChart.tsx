import {
  Box,
  Heading,
  HStack,
  Link,
  Skeleton,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Point, PointSymbolProps, Serie } from "@nivo/line"
import { PercentageText } from "components/PercentageText"
import { CardBase } from "components/_cards/CardBase"
import { TransparentCard } from "components/_cards/TransparentCard"
import { TokenValueColumn } from "components/_columns/TokenValueColumn"
import { TokenValueTable } from "components/_tables/TokenValueTable"
import { format, isSameDay } from "date-fns"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { colors } from "theme/colors"
import { ChartPoint } from "./ChartPoint"
import { ChartPointRebalance } from "./ChartPointRelabance"
import { Legend } from "./Legend"
import {
  subDays,
  subWeeks,
  subMonths,
  endOfMonth,
  setDay,
} from "date-fns"
import { IoIosArrowForward } from "react-icons/io"

const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

const staticColorArray = ["white", "#ED4A7D"]

type TokenData = {
  name: string
  date: Date
  percentChange: number
  rebalancing: boolean
  tokenPrice: number
}

type windowDate = "1W" | "1M" | "1Y" | "1YperWeek"

function generateTokenData(
  tokenName: string,
  windowDate: windowDate,
  hasRebalancing: boolean
): TokenData[] {
  const data: TokenData[] = []
  let dateCount: number
  let rebalanceFrequency: number

  switch (windowDate) {
    case "1W":
      dateCount = 7
      rebalanceFrequency = 1
      break
    case "1M":
      dateCount = 30
      rebalanceFrequency = 2
      break
    case "1Y":
      dateCount = 12
      rebalanceFrequency = 2
      break
    case "1YperWeek":
      dateCount = 52
      rebalanceFrequency = 24
      break
    default:
      throw new Error("Invalid windowDate parameter")
  }

  let tokenPrice = 100
  let rebalanceCounter = 0

  for (let i = 0; i < dateCount; i++) {
    let date = new Date()

    if (windowDate === "1Y") {
      date = endOfMonth(subMonths(date, i))
    } else if (windowDate === "1YperWeek") {
      date = setDay(subWeeks(date, i), 5)
    } else {
      date = subDays(date, i)
    }

    const percentChange = parseFloat(
      (Math.random() * 2 - 1).toFixed(2)
    )
    tokenPrice = parseFloat(
      (tokenPrice * (1 + percentChange)).toFixed(2)
    )
    const rebalancing =
      hasRebalancing &&
      rebalanceCounter < rebalanceFrequency &&
      Math.random() < 0.5

    if (rebalancing) {
      rebalanceCounter++
    }

    data.unshift({
      name: tokenName,
      date: date,
      percentChange,
      rebalancing,
      tokenPrice,
    })
  }

  return data
}

const dummyTableData = {
  id: "first",
  title: "Token Value",
  price: 1.94,
  changes: {
    daily: 0.2,
    weekly: 0.3,
    monthly: 0.4,
    yearly: 0.5,
    allTime: 0.6,
  },
  color: "white",
}

const dummyTableData2 = {
  id: "second",
  title: "USDC",
  price: 2,
  changes: {
    daily: 0.1,
    weekly: 0.2,
    monthly: 0.3,
    yearly: -0.1,
    allTime: 0.2,
  },
  color: "#ED4A7D",
}

const tableData = [dummyTableData, dummyTableData2]

const TokenChart = ({
  windowDate = "1M",
}: {
  windowDate?: windowDate
}) => {
  const tokenData = useMemo(
    () => generateTokenData("ETH", windowDate, true),
    [windowDate]
  )

  const secondTokenData = useMemo(
    () => generateTokenData("USDC", windowDate, false),
    [windowDate]
  )
  const divRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  const chartData: Serie[] = useMemo(
    () => [
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
    ],
    [tokenData, secondTokenData]
  )
  const [selectedPoint, setSelectedPoint] = useState<Point>()
  const [pointActive, setPointActive] = useState<Point>()
  const [showLine, setShowLine] = useState<{
    [key: string]: boolean
  }>({
    first: true,
    second: false,
  })
  const filteredChartData = useMemo(() => {
    return chartData.filter((item) => showLine[item.id])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLine])

  const filteredTableData = useMemo(() => {
    return tableData.filter((item) => showLine[item.id])
  }, [showLine])

  const pointActiveIndex =
    selectedPoint?.id.split(".")[1] ||
    pointActive?.id.split(".")[1] ||
    "0"

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

  // useEffect(() => {
  //   if (pointActive) {
  //     if (pointActive.id !== selectedPoint?.id) {
  //       const selectedPointIndex = selectedPoint?.id.split(".")[1]
  //       if (pointActiveIndex !== selectedPointIndex) {
  //         setSelectedPoint(undefined)
  //       }
  //     }
  //   }
  // }, [pointActive, selectedPoint, pointActiveIndex])

  const lineColors = useMemo(() => {
    return chartData.map((item) => item.color)
  }, [chartData])

  const { chartTheme } = useNivoThemes()

  const Point: FunctionComponent<PointSymbolProps> = ({
    color,
    datum,
  }) => {
    const active = isSameDay(
      new Date(String(datum.x)),
      new Date(String(pointActive?.data.x))
    )

    const isRebalance = datum.isRebalance

    if (isRebalance) {
      return (
        <ChartPointRebalance
          fill={color}
          stroke={colors.neutral[100]}
        />
      )
    }

    if (active) {
      return <ChartPoint fill={color} stroke={colors.neutral[100]} />
    }

    return null
  }

  const renderFrequency = (windowDate: windowDate) => {
    let frequency: string | undefined

    switch (windowDate) {
      case "1W":
        frequency = "every day"
        break
      case "1M":
        frequency = "every 2 days"
        break
      case "1Y":
        frequency = undefined
        break
      case "1YperWeek":
        frequency = "every 20 days"
        break
      default:
        throw new Error("Invalid windowDate parameter")
    }

    return frequency
  }

  useEffect(() => {
    const currentDiv = divRef.current

    if (currentDiv) {
      setWidth(currentDiv.offsetWidth)
    }

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === currentDiv) {
          setWidth(entry.contentRect.width)
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (currentDiv) {
      resizeObserver.observe(currentDiv)
    }

    return () => {
      if (currentDiv) {
        resizeObserver.unobserve(currentDiv)
      }
    }
  }, [])

  const pointX = selectedPoint?.x ?? pointActive?.x ?? 0
  const currentActivePoint = selectedPoint || pointActive

  return (
    <Skeleton
      ref={divRef}
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
          <Box height={230}>
            <LineChart
              onClick={(point) => {
                if (
                  selectedPoint &&
                  (point.data as { date?: Date }).date ===
                    (selectedPoint?.data as { date?: Date }).date
                ) {
                  setSelectedPoint(undefined)
                  return
                }
                if (
                  (point.data as { isRebalance?: boolean })
                    ?.isRebalance
                ) {
                  setSelectedPoint(point)
                }
              }}
              animate={false}
              colors={lineColors}
              crosshairType="x"
              onMouseMove={(point) => onMouseMove(point as any)}
              onMouseLeave={() => {
                setPointActive(undefined)
              }}
              data={filteredChartData || []}
              margin={{ bottom: 110, left: 30, right: 26, top: 20 }}
              yScale={{
                type: "linear",
                stacked: false,
                max: 3,
                min: -3,
              }}
              xScale={{
                type: "time",
                format: "%d",
                useUTC: false,
                precision: "day",
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
                        transform={
                          windowDate !== "1W"
                            ? "rotate(45, 0, 0)"
                            : undefined
                        }
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
                tickValues: renderFrequency(windowDate),
                tickSize: 5,
                tickPadding: 5,
              }}
              axisLeft={{
                tickValues: [-3, "-2", "-1", 0, "1", "2", 3],
                renderTick: (tick) => {
                  return (
                    <g
                      transform={`translate(${tick.x - 20},${
                        tick.y
                      })`}
                    >
                      <text
                        x={0}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fill: "#9E9DA3",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {typeof tick.value === "string"
                          ? "-"
                          : tick.value}
                      </text>
                    </g>
                  )
                },
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
          {(selectedPoint || (pointActive && pointActiveIndex)) && (
            <CardBase
              zIndex={9}
              left={
                pointX > ((width > 800 ? 80 : 50) / 100) * width
                  ? pointX - 150
                  : pointX < ((width > 800 ? 5 : 50) / 100) * width
                  ? pointX + 10
                  : parseInt(pointActiveIndex) === 0
                  ? pointX + 10
                  : pointX - 60
              }
              position="absolute"
              boxShadow="0px 0px 34px rgba(0,0,0,0.55)"
              bgColor="neutral.900"
              maxW="261px"
              minW="260px"
              bottom={"180px"}
            >
              <Box w="100%" textAlign="left">
                {filteredChartData?.map((item) => {
                  const itemData =
                    item.data[parseInt(pointActiveIndex)]
                  return (
                    <Box key={item.id}>
                      {(
                        currentActivePoint?.data as {
                          isRebalance?: boolean
                        }
                      ).isRebalance && (
                        <Link
                          href="https://etherscan.io/"
                          isExternal
                          _hover={{ textDecoration: "none" }}
                        >
                          <HStack mb={2}>
                            <Text>View rebalance</Text>
                            <Spacer />
                            <IoIosArrowForward fontSize={"20px"} />
                          </HStack>
                        </Link>
                      )}
                      <HStack
                        justifyContent="flex-start"
                        alignItems="center"
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

                        <Text>{itemData.name}:</Text>
                        <Text textAlign="right">
                          {itemData.price}
                        </Text>
                        <Spacer />
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
        <TokenValueTable
          columns={TokenValueColumn(true)}
          data={filteredTableData || []}
        />
      </TransparentCard>
    </Skeleton>
  )
}
export { TokenChart }
