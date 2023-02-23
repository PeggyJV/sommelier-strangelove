import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"

export const getTvm = async (tvlTotal?: string) => {
  try {
    const calculatedTvl = tvlTotal && formatDecimals(tvlTotal, 18)
    const tvmVal = formatCurrency(calculatedTvl)

    return {
      value: calculatedTvl,
      formatted: `$${tvmVal}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
