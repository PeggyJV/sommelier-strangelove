import { useTheme } from '@chakra-ui/react'

/**
 * @returns different Arrays of color strings for nivo charts.
 */
export const useNivoThemes = () => {
  const { colors } = useTheme()

  const barChartTheme: string[] = [
    colors.energyYellow,
    colors.deepSkyBlue[500],
    colors.sunsetOrange
  ]

  const lineChartTheme: string[] = [
    colors.sunsetOrange,
    colors.deepSkyBlue[500],
    colors.energyYellow
  ]

  return { barChartTheme, lineChartTheme }
}
