import { tokenConfig } from "data/tokenConfig"
import { AaveV2CellarV2 } from "src/abi/types"
import { getCurrentAsset } from "utils/getCurrentAsset"

export const getActiveAsset = async (
  cellarContract: AaveV2CellarV2
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
