import { fetchToken } from "@wagmi/core"
import { Token } from "data/tokenConfig"
import { CellarV0815, CellarV0816 } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { formatCurrency } from "utils/formatCurrency"
import { getAddress } from "ethers/lib/utils.js"

export const getTotalAssets = async (
  cellarContract: CellarV0815 | CellarV0816,
  activeAsset: Pick<Token, "address">
) => {
  try {
    const totalAssets = await cellarContract.totalAssets()

    const token = await fetchToken({
      address: getAddress(activeAsset.address),
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
