import { CellarV0815, CellarV0816 } from "src/abi/types"

export const getPreviewRedeem = async ({
  cellarContract,
  value,
}: {
  cellarContract: CellarV0815 | CellarV0816
  value?: string
}) => {
  if (!value) return
  try {
    const shares = await cellarContract.previewRedeem(value)
    return {
      value: shares,
    }
  } catch (e) {
    console.error("Error in getPreviewRedeem", e)
    return null
  }
}
