import { ethers } from "ethers"
import { CellarV0815, CellarV0816 } from "src/abi/types"

export const getPreviewRedeem = async ({
  cellarContract,
  value,
}: {
  cellarContract: CellarV0815 | CellarV0816
  value?: number
}) => {
  if (!value) return
  try {
    const convertedValue = ethers.utils.parseUnits(`${value}`, 18)
    const shares = await cellarContract.previewRedeem(convertedValue)
    console.log("Shares", shares)
    return {
      value: shares,
    }
  } catch (e) {
    console.error("Error in getPreviewRedeem", e)
    return null
  }
}
