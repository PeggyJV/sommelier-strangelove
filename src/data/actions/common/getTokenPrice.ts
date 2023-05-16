import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"

export const getTokenPrice = (
  shareValue?: string,
  decimals?: number
) => {
  const calculatedshareValue =
    shareValue && formatDecimals(shareValue, decimals, 4)
  const shareValueFormatted =
    shareValue &&
    formatCurrency(formatDecimals(shareValue, decimals, 2))

  return {
    value: calculatedshareValue,
    formatted: calculatedshareValue && `$${shareValueFormatted}`,
  }
}
