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
    colors.red.base,
    colors.turquoise.base,
    colors.violet.base,
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
  }

  return { barChartTheme, lineChartTheme, chartTheme }
}
