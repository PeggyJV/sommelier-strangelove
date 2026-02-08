import { formatUnits } from "viem"

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
  val:
    | string
    | number
    | bigint
    | { toString(): string }
    | null
    | undefined,
  decimals = 18,
  format?: boolean | number,
  precision = 2
) => {
  if (val != 0n && (!val || val === "--")) return "--"
  try {
    if (typeof val === 'bigint') val = formatUnits(val, decimals)
    const result = parseFloat(String(val))
    if (format) {
      format = typeof format === "boolean" ? 2 : format
      return result.toLocaleString("en-US", { minimumFractionDigits: format, maximumFractionDigits: format });
    }
    return floorToPrecision(result, precision).toString()
  } catch (e) {
    console.log(e)
    return "--"
  }
}
const floorToPrecision = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.floor(num * factor) / factor;
};
