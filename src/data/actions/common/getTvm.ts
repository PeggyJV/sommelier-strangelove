import { AaveV2CellarV2, ClearGateCellar } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"

export const getTvm = async (
  cellarContract: AaveV2CellarV2 | ClearGateCellar,
  tvlTotal?: string
) => {
  try {
    const calculatedTvl = tvlTotal && formatDecimals(tvlTotal, 18)
    const tvmVal = formatCurrency(calculatedTvl)

    return {
      value: tvmVal,
      formatted: `$${tvmVal}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
