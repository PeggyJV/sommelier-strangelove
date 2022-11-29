import {
  Box,
  HStack,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import { DatumValue, linearGradientDef } from "@nivo/core"
import {
  Point,
  PointSymbolProps,
  PointTooltipProps,
} from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import { FunctionComponent, useMemo, useState, VFC } from "react"
import { colors } from "theme/colors"
import { format, isSameDay, isSameHour } from "date-fns"
import { formatPercentage } from "utils/chartHelper"
import { useUsdcChart } from "data/context/usdcChartContext"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

export const UsdcChart: VFC<{ timeline: string; name: string }> = ({
  timeline,
  name: strategyTokenName,
}) => {
  const { data } = useUsdcChart()
  const { chartTheme } = useNivoThemes()
  const lineColors = data.series?.map((item) => item.color)
  const [pointActive, setPointActive] = useState<DatumValue>()
  const onMouseMove = (point: Point, event: React.MouseEvent) => {
    setPointActive(point.data.x)
  }
  const [isLarger768] = useMediaQuery("(min-width: 768px)")

  const ToolTip: FunctionComponent<PointTooltipProps> = ({
    point,
  }) => {
    const { id, serieId } = point
    const [_, i] = id.split(".")
    if (isLarger768) {
      return (
        <Stack
          p={4}
          bg="rgba(18, 18, 20, 0.8)"
          borderWidth={1}
          borderColor="purple.base"
          borderRadius={8}
          textTransform="capitalize"
        >
          {data.series?.map((item) => {
            const name = (() => {
              if (item.id === "token-price") return strategyTokenName
              if (item.id === "usdc") return "USDC"
              return ""
            })()
            return (
              <HStack
                key={item.id}
                justifyContent="space-between"
                spacing={4}
              >
                <HStack spacing={4}>
                  <Box
                    boxSize="8px"
                    backgroundColor={item.color}
                    borderRadius={2}
                  />
                  <Text>
                    {name}:{" "}
                    {formatPercentage(
                      String(
                        data.series?.find((s) => s.id === item.id)
                          ?.data[Number(i)]?.value
                      )
                    )}
                    $
                  </Text>
                </HStack>

                <Text>
                  {formatPercentage(
                    String(
                      data.series?.find((s) => s.id === item.id)
                        ?.data[Number(i)]?.y
                    )
                  )}
                  %
                </Text>
              </HStack>
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
            new Date(String(pointActive))
          )
        : isSameDay(
            new Date(String(datum.x)),
            new Date(String(pointActive))
          )
    if (active && isLarger768) {
      return (
        <svg height="16" width="16" x="-7.5" y="-7.5">
          <circle
            cx="7"
            cy="7"
            r="6"
            fill={color}
            strokeWidth="2"
            stroke={colors.neutral[100]}
          />
        </svg>
      )
    }
    return null
  }

  const hourlyAxisBottom = useMemo<any>(() => {
    if (timeline === "1D") {
      return {
        axisBottom: {
          format: "%d %H:%M",
          tickValues: isLarger768 ? "every 3 hours" : "every 6 hours",
        },
      }
    }
  }, [isLarger768, timeline])

  return (
    <LineChart
      {...data.chartProps}
      {...hourlyAxisBottom}
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
      margin={{ bottom: 110, left: 50, right: 6, top: 20 }}
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
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
      }}
      useMesh={isLarger768}
    />
  )
}
