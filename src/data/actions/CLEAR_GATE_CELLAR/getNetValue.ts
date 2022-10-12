import BigNumber from "bignumber.js"
import { formatUSD, toEther } from "utils/formatCurrency"

export const getNetValue = (
  lpTokenValue: string,
  decimals: number
) => {
  const nv = new BigNumber(toEther(lpTokenValue, decimals, false, 2))
  const formattedNetValue = nv.toFixed(2, 0)

  return {
    value: nv,
    formatted: formatUSD(formattedNetValue),
  }
}
