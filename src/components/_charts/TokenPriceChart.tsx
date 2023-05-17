import { Stack, Text } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import {
  Point,
  PointSymbolProps,
  PointTooltipProps,
} from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
  VFC,
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
  }
)
interface TokenPriceChartProps {
  timeline: string
  name: string
  pointActive?: Point
  setPointActive: Dispatch<SetStateAction<Point | undefined>>
}
export const TokenPriceChart: VFC<TokenPriceChartProps> = ({
  timeline,
  name: strategyTokenName,
  pointActive,
  setPointActive,
}) => {
  const { data } = useTokenPriceChart()
  const { chartTheme } = useNivoThemes()
  const lineColors = data.series?.map((item) => item.color)
  const onMouseMove = (point: Point, event: React.MouseEvent) => {
    setPointActive(point)
  }
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")

  const ToolTip: FunctionComponent<PointTooltipProps> = ({
    point,
  }) => {
    const { id, serieId } = point
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

  const Point: FunctionComponent<PointSymbolProps> = ({
    color,
    datum,
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
              ? "every 1 day"
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
      if (data.series && data.series.length < 30) {
        return {
          axisBottom: {
            format: "%d.%b",
            tickValues: "every 3 days",
          },
        }
      }
      if (data.series && data.series.length < 120) {
        return {
          axisBottom: {
            format: "%d.%b",
            tickValues: "every 5 days",
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
      axisBottom={{
        renderTick: isLarger768
          ? undefined
          : (tick) => {
              const day = tick.value.getDate()
              const month = tick.value.toLocaleString("default", {
                month: "short",
              })

              return (
                <g transform={`translate(${tick.x},${tick.y + 20})`}>
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
                    <tspan x="0" dy="0">
                      {day}
                    </tspan>
                    <tspan x="0" dy="15">
                      {month}
                    </tspan>
                  </text>
                </g>
              )
            },
        ...hourlyAxisBottom.axisBottom,
      }}
      data={data.series || []}
      colors={lineColors}
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
