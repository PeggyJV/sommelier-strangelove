import BigNumber from "bignumber.js"

export const formatCurrentDeposits = (
  addedLiquidityAllTime?: string,
  removedLiquidityAllTime?: string
) => {
  const definedVals = addedLiquidityAllTime && removedLiquidityAllTime
  const alat = definedVals
    ? new BigNumber(addedLiquidityAllTime).dividedBy(10 ** 18)
    : new BigNumber(0)

  const rlat = definedVals
    ? new BigNumber(removedLiquidityAllTime).dividedBy(10 ** 18)
    : new BigNumber(0)
  const currentDepositsVal =
    definedVals && alat.minus(rlat).toString()

  return currentDepositsVal
}
