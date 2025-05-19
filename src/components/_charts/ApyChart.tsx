import { Stack, Text } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { LineSeries, Point, PointTooltipProps, AllowedValue } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo
} from "react"
import { colors } from "theme/colors"
import { format, isSameDay, isSameHour } from "date-fns"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { ChartPoint } from "./ChartPoint"
import { ChartTooltipItem } from "./ChartTooltipItem"
import { useApyChart } from "data/context/apyChartContext"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)
interface TokenPriceChartProps {
  timeline: string
  pointActive?: Point<LineSeries>
  setPointActive: Dispatch<
    SetStateAction<Point<LineSeries> | undefined>
  >
}
export const ApyChart = ({
  timeline,
  pointActive,
  setPointActive,
}: TokenPriceChartProps) => {
  const { data } = useApyChart()
  const { chartTheme } = useNivoThemes()
  const onMouseMove = (
    point: Point<LineSeries>
  ) => {
    setPointActive(point)
  }
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")

  const ToolTip: FunctionComponent<PointTooltipProps<LineSeries>> = ({
    point,
  }) => {
    const { id } = point
    const [_, i] = id.split(".")
    if (isLarger768) {
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
            return (
              <ChartTooltipItem
                key={item.id}
                backgroundColor="neutral.100"
                name={data.label + " Moving Average APY"}
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
              new Date(
                String(data.series?.[0].data[Number(i)].x)
              ),
              "MMM, d, yyyy, HH:mm"
            )}
          </Text>
        </Stack>
      )
    }
    return null
  }

  const Point = ({
    color,
    datum,
  }: {
    color: string
    datum: { x: AllowedValue; y: AllowedValue }
  }) => {
    const active =
      timeline === "1D"
        ? isSameHour(
            new Date(String(datum.x)),
            new Date(String(pointActive?.data.x))
          )
        : isSameDay(
            new Date(String(datum.x)),
            new Date(String(pointActive?.data.x))
          )
    if (active) {
      return <ChartPoint fill={color} stroke="neutral.100" />
    }
    return null
  }

  const hourlyAxisBottom = useMemo<any>(() => {
    if (timeline === "1D") {
      return {
        axisBottom: {
          format: "%d.%b %H:%M",
          tickValues: isLarger768 ? "every 3 hours" : "every 6 hours",
        },
      }
    }
    if (timeline === "7D" || timeline === "30D") {
      // show format in day.month
      return {
        axisBottom: {
          format: "%d.%b",
          tickValues: isLarger768 ? "every 2 days" : "every 5 days",
        },
      }
    }
    if (
      timeline === "1Y" ||
      timeline === "ALL" ||
      timeline === "All"
    ) {
      if (data.series && data.series[0].data.length < 30) {
        return {
          axisBottom: {
            format: "%d.%b",
            tickValues: isLarger768 ? "every 3 days" : "every 5 days",
          },
        }
      }
      if (data.series && data.series[0].data.length < 60) {
        return {
          axisBottom: {
            format: "%d.%b",
            tickValues: isLarger768
              ? "every 5 days"
              : "every 10 days",
          },
        }
      }
      // show format in month.year
      return {
        axisBottom: {
          format: "%b.%y",
          tickValues: "every 1 month",
        },
      }
    }
  }, [isLarger768, timeline, data])

  return (
    <LineChart
      {...data.chartProps}
      {...hourlyAxisBottom}
      data={data.series || []}
      colors={colors.neutral[100]}
      animate={false}
      crosshairType="x"
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      margin={{ bottom: 110, left: 35, right: 18, top: 20 }}
      theme={chartTheme}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        setPointActive(undefined)
      }}
      tooltip={ToolTip}
      pointSymbol={Point}
      pointSize={16}
      enablePoints
      yScale={{
        type: "linear",
        stacked: false,
        max: "auto",
        clamp: true,
        nice: true,
        stepSize: 1,
      }}
      axisLeft={{
        renderTick: (tick) => {
          return (
            <g
              transform={`translate(${tick.x + 3},${tick.y})`}
              style={{ opacity: 1 }}
            >
              <line
                x1="0"
                x2="-3"
                y1="0"
                y2="0"
                style={{
                  stroke: "rgb(237, 235, 245)",
                  strokeWidth: 1,
                }}
              />
              <text
                transform="translate(-4, 0)"
                textAnchor="end"
                dominantBaseline="central"
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 9,
                  fill: "rgb(237, 235, 245)",
                }}
              >
                {tick.value} %
              </text>
            </g>
          )
        },
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        tickValues: 5,
      }}
    />
  )
}
