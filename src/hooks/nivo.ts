import { useTheme } from "@chakra-ui/react"
import { PartialTheme } from "@nivo/theming"

/**
 * @returns different Arrays of color strings for nivo charts.
 */
export const useNivoThemes = () => {
  const { colors } = useTheme()

  const barChartTheme: string[] = [
    colors.turquoise.base,
    colors.violet.base,
    colors.red.base,
  ]

  const lineChartTheme: string[] = [
    colors.purple.base,
    colors.turquoise.base,
    colors.red.base,
  ]

  const chartTheme: PartialTheme = {
    axis: {
      ticks: {
        line: {
          stroke: colors.neutral[200],
        },
        text: {
          fill: colors.neutral[200],
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
