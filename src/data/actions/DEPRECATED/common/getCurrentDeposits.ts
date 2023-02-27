import { formatCurrency } from "utils/formatCurrency"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"

export const getCurrentDeposits = async ({
  assetSymbol,
  addedLiquidityAllTime,
  removedLiquidityAllTime,
}: {
  assetSymbol?: string
  addedLiquidityAllTime?: string
  removedLiquidityAllTime?: string
}) => {
  try {
    if (!addedLiquidityAllTime)
      throw new Error("addedLiquidityAllTime is undefined")
    if (!removedLiquidityAllTime)
      throw new Error("addedLiquidityAllTime is undefined")

    const currentDepositsVal = formatCurrentDeposits(
      addedLiquidityAllTime,
      removedLiquidityAllTime
    )

    return {
      value: currentDepositsVal,
      formatted: `${formatCurrency(
        currentDepositsVal
      )} ${assetSymbol}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
