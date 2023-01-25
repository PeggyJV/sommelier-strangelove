import { fetchToken } from "@wagmi/core"
import { CellarV0815, CellarV0816 } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"
import { getActiveAsset } from "./getActiveAsset"

export const getTotalAssets = async (
  cellarContract: CellarV0815 | CellarV0816
) => {
  try {
    const totalAssets = await cellarContract.totalAssets()
    const activeAsset = await getActiveAsset(cellarContract)
    if (!activeAsset) {
      throw new Error("activeAssetAddress undefined")
    }

    const token = await fetchToken({
      address: activeAsset.address,
      chainId: 1,
    })
    const res = formatDecimals(totalAssets.toString(), token.decimals)
    const tvmVal = formatCurrency(res)

    return {
      value: res,
      formatted: `$${tvmVal}`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
