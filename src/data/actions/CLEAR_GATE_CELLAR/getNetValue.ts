import BigNumber from "bignumber.js"
import { BigNumber as BigNumberE } from "ethers"
import { formatUSD } from "utils/formatCurrency"

export const getNetValue = (lpTokenValue: BigNumberE) => {
  const val = new BigNumber(lpTokenValue.toString())
  const formattedNetValue = val.toFixed(2, 0)
  return {
    value: val,
    formatted: formatUSD(formattedNetValue),
  }
}
