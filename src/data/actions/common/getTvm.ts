import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"

export const getTvm = (tvlTotal?: string) => {
  const calculatedTvl = tvlTotal && formatDecimals(tvlTotal, 18)
  const tvmVal = formatCurrency(calculatedTvl)

  return {
    value: calculatedTvl,
    formatted: calculatedTvl && `$${tvmVal}`,
  }
}
