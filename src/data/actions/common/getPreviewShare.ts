export const getPreviewRedeem = async ({
  cellarContract,
  value,
}: {
  cellarContract: unknown
  value?: string
}) => {
  if (!value) return
  try {
    const contract = cellarContract as {
      read: { previewRedeem: (args: [string]) => Promise<bigint> }
    }
    const shares = await contract.read.previewRedeem([value])
    return {
      value: shares,
    }
  } catch (e) {
    console.error("Error in getPreviewRedeem", e)
    return null
  }
}
