import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"

export const getTokenPrice = (shareValue?: string) => {
  const calculatedshareValue =
    shareValue && formatDecimals(shareValue, 6, 4)
  const shareValueFormatted =
    shareValue && formatCurrency(formatDecimals(shareValue, 6, 2))

  return {
    value: calculatedshareValue,
    formatted: calculatedshareValue && `$${shareValueFormatted}`,
  }
}
