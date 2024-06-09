import { formatCurrency } from "utils/formatCurrency"
import { formatUnits } from "viem"

export const getTokenPrice = (
  shareValue: string,
  decimals: number
) => {
  const calculatedshareValue = Number(
      formatUnits(
        BigInt(shareValue),
        decimals)
    )
      .toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const shareValueFormatted =
    formatCurrency(formatUnits(BigInt(shareValue), decimals))

  return {
    value: calculatedshareValue,
    formatted: calculatedshareValue && `$${shareValueFormatted}`,
  }
}
