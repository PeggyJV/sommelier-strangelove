import { formatCurrency } from "utils/formatCurrency"

export const getTvm = (tvlTotal?: string) => {
  const calculatedTvl =
    (tvlTotal) ?? "0"
  const tvmVal = formatCurrency(calculatedTvl)

  return {
    value: calculatedTvl,
    formatted: calculatedTvl && `$${tvmVal}`,
  }
}
