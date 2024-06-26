export const getPreviewRedeem = async ({
  cellarContract,
  value,
}: {
  cellarContract: any
  value?: string
}) => {
  if (!value) return
  try {
    const shares = await cellarContract.read.previewRedeem([value])
    return {
      value: shares,
    }
  } catch (e) {
    console.error("Error in getPreviewRedeem", e)
    return null
  }
}
