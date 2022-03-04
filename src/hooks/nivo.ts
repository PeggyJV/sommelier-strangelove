import { useTheme } from '@chakra-ui/react'

/**
 * @returns different Arrays of color strings for nivo charts.
 */
export const useNivoThemes = () => {
  const { colors } = useTheme()

  const barChartTheme: string[] = [
    colors.electricIndigo[500],
    colors.deepSkyBlue[500],
    colors.brilliantRose[500]
  ]

  const lineChartTheme: string[] = [
    colors.brilliantRose[500],
    colors.deepSkyBlue[500],
    colors.electricIndigo[500]
  ]

  return { barChartTheme, lineChartTheme }
}
