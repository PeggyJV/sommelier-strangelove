const getUrl = (cellarId: string, shares: BigInt) =>
  `/api/cellar-preview-redeem?cellarId=${cellarId}&shares=${shares}`

export const fetchCellarPreviewRedeem = async (
  cellarId: string,
  shares: BigInt
) => {
  const url = getUrl(cellarId, shares)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result ? result.sharesValue : undefined
  } catch (error) {
    console.log("Error fetching Cellar Preview Redeem", error)
    throw Error(error as string)
  }
}
