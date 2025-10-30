import { formatUnits } from "viem"

export const formatCurrency = (value?: string) => {
  return value ? new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(parseFloat(value)) : undefined
}

export const formatUSD = (value?: string, maximumDigit?: number) => {
  return value ? new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maximumDigit || 2,
    minimumFractionDigits: 2,
  }).format(parseFloat(value)) : undefined
}

export const toEther = (
  val: any | undefined,
  decimals = 18,
  format?: boolean | number,
  precision = 2
) => {
  if (val != 0n && (!val || val === "--")) return "--"
  try {
    const formattedVal = typeof val === 'bigint' ? formatUnits(val, decimals) : val
    const result = parseFloat(formattedVal)
    if (format) {
      const digits = typeof format === "boolean" ? 2 : format
      return result.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })
    }
    const factor = Math.pow(10, precision)
    return (Math.floor(result * factor) / factor).toString()
  } catch (e) {
    console.log(e)
    return "--"
  }
}
