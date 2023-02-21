import { ethers } from "ethers"
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

export const formatUSD = (value?: string) => {
  const v =
    value &&
    Intl.NumberFormat("en-US", {
      notation: "compact",
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(parseFloat(value))

  return v
}

export const toEther = (
  val: ethers.BigNumberish | undefined,
  decimals = 18,
  format = true,
  precision = 3
) => {
  if (!val || val === "--") return "--"
  try {
    const fmt = ethers.utils.formatUnits(val, decimals)
    const result = new BigNumber(fmt)
    if (format) return result.toFormat(2)
    return result.toFixed(precision, 1)
  } catch (e) {
    console.log(e)
    return "--"
  }
}
