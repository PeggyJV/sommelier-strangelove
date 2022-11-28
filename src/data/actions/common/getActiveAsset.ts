import { tokenConfig } from "data/tokenConfig"
import { CellarV0815, CellarV0816 } from "src/abi/types"
import { getCurrentAsset } from "utils/getCurrentAsset"

export const getActiveAsset = async (
  cellarContract: CellarV0815 | CellarV0816
) => {
  try {
    const activeAssetAddress = await cellarContract.asset()
    const activeAsset = getCurrentAsset(
      tokenConfig,
      activeAssetAddress
    )

    return activeAsset
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
