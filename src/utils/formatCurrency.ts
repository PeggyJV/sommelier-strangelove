import { ethers } from "ethers"
import BigNumber from "bignumber.js"

export const formatCurrency = (tvlTotal?: string) => {
  const tvmVal =
    tvlTotal &&
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(parseInt(tvlTotal))

  return tvmVal
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
