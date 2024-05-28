import { formatUnits } from 'viem'
import BigNumber from "bignumber.js"

export const formatCurrency = (value?: string) => {
  const v =
    value &&
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(parseFloat(value))

  return v
}

export const formatUSD = (value?: string, maximumDigit?: number) => {
  const v =
    value &&
    Intl.NumberFormat("en-US", {
      notation: "compact",
      style: "currency",
      currency: "USD",
      maximumFractionDigits: maximumDigit || 2,
      minimumFractionDigits: 2,
    }).format(parseFloat(value))

  return v
}

export const toEther = (
  val: any | undefined,
  decimals = 18,
  format?: boolean | number,
  precision = 2
) => {
  if (!val || val === "--") return "--"
  try {
    const fmt = formatUnits(val, decimals)
    const result = new BigNumber(fmt)
    if (format)
      return result.toFormat(typeof format === "boolean" ? 2 : format)
    return result.toFixed(precision, 1)
  } catch (e) {
    console.log(e)
    return "--"
  }
}
