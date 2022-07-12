import BigNumber from "bignumber.js"

export function getPNL(
  maxWithdraw: BigNumber,
  currentDeposits: BigNumber
): BigNumber {
  if (maxWithdraw.eq(0) || currentDeposits.eq(0)) {
    return new BigNumber("0")
  }

  const gains = maxWithdraw.minus(currentDeposits)
  return gains.div(currentDeposits).times(100)
}
