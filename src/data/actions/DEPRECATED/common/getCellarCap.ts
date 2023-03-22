import BigNumber from "bignumber.js"
import { formatCurrency } from "utils/formatCurrency"

export const getCellarCap = async ({
  liquidityLimit,
  assetDecimals,
  assetSymbol,
}: {
  liquidityLimit?: string
  assetDecimals?: number
  assetSymbol?: string
}) => {
  try {
    if (!liquidityLimit)
      throw new Error("liquidityLimit is undefined")

    const cellarCap = new BigNumber(liquidityLimit)
      .dividedBy(10 ** (assetDecimals || 0))
      .toString()

    return {
      value: cellarCap,
      formatted: `${formatCurrency(cellarCap)} ${assetSymbol}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
