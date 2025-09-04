import { Stack, Text } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { LineSeries, Point, PointTooltipProps } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
} from "react"
import { colors } from "theme/colors"
import { format, isSameDay, isSameHour } from "date-fns"
import { formatPercentage } from "utils/chartHelper"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { ChartPoint } from "./ChartPoint"
import { ChartTooltipItem } from "./ChartTooltipItem"
import { useTokenPriceChart } from "data/context/tokenPriceChartContext"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
    loading: () => null,
  }
)
interface TokenPriceChartProps {
  timeline: string
  name: string
  pointActive?: Point<LineSeries>
  setPointActive: Dispatch<
    SetStateAction<Point<LineSeries> | undefined>
  >
}
export const TokenPriceChart = ({
  timeline,
  name: strategyTokenName,
  pointActive,
  setPointActive,
}: TokenPriceChartProps) => {
  const { data } = useTokenPriceChart()
  const { chartTheme } = useNivoThemes()
  const onMouseMove = (point: Point<LineSeries>) => {
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
            const name = (() => {
              if (item.id === "token-price") return strategyTokenName
              return ""
            })()
            return (
              <ChartTooltipItem
                key={item.id}
                backgroundColor="neutral.100"
                name={name}
                value={`$${
                  data.series?.find((s) => s.id === item.id)?.data[
                    Number(i)
                  ]?.y
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

  const Point = ({
    color,
    datum,
  }: {
    color: string
    datum: { x: Date; y: string }
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
      return <ChartPoint fill={color} stroke={colors.neutral[100]} />
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
    if (timeline === "1W" || timeline === "1M") {
      // show format in day.month
      return {
        axisBottom: {
          format: "%d.%b",
          tickValues:
            timeline === "1W"
              ? isLarger768
                ? "every 1 day"
                : "every 2 days"
              : isLarger768
              ? "every 2 days"
              : "every 5 days",
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
      enableArea={true}
      animate={false}
      crosshairType="x"
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      margin={{ bottom: 110, left: 26, right: 18, top: 20 }}
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
        min: "auto",
      }}
      axisLeft={{
        tickRotation: 0,
        legendPosition: "middle",
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
      }}
    />
  )
}
