export const formatCurrentDeposits = (
  addedLiquidityAllTime?: string,
  removedLiquidityAllTime?: string
) => {
  const definedVals = addedLiquidityAllTime && removedLiquidityAllTime
  const currentDepositsVal =
    definedVals &&
    parseInt(addedLiquidityAllTime) -
      parseInt(removedLiquidityAllTime)

  return currentDepositsVal
}
