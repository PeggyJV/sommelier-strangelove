import { AaveV2CellarV2, ClearGateCellar } from "src/abi/types"
import { getCalulatedTvl } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"
import { getActiveAsset } from "./getActiveAsset"

export const getTvm = async (
  cellarContract: AaveV2CellarV2 | ClearGateCellar,
  tvlTotal?: string
) => {
  try {
    const activeAsset = await getActiveAsset(cellarContract)
    const activeSymbol = activeAsset?.symbol

    const calculatedTvl = tvlTotal && getCalulatedTvl(tvlTotal, 18)
    const tvmVal = formatCurrency(calculatedTvl)

    return {
      value: tvmVal,
      formatted: `$${tvmVal} ${activeSymbol}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
