import { useTheme } from "@chakra-ui/react"

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

  return { barChartTheme, lineChartTheme }
}
