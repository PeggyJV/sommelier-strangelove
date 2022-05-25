import { useTheme } from "@chakra-ui/react"
import { Theme } from "@nivo/core"

/**
 * @returns different Arrays of color strings for nivo charts.
 */
export const useNivoThemes = () => {
  const { colors } = useTheme()

  const barChartTheme: string[] = [
    colors.violet.base,
    colors.turquoise.base,
    colors.red.base,
  ]

  const lineChartTheme: string[] = [
    colors.purple.base,
    colors.turquoise.base,
    colors.red.base,
  ]

  const chartTheme: Theme = {
    textColor: colors.neutral[200],
    axis: {
      ticks: {
        line: {
          stroke: colors.neutral[200],
        },
      },
    },
    crosshair: {
      line: {
        stroke: colors.purple.dark,
        strokeWidth: 2,
        strokeDasharray: "solid",
      },
    },
  }

  return { barChartTheme, lineChartTheme, chartTheme }
}
