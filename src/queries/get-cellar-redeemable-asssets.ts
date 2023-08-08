const getUrl = (cellarId: string) =>
  `/api/cellar-redeemable-reserves?cellarId=${cellarId}`

export const fetchCellarRedeemableReserves = async (cellarId: string) => {
  const url = getUrl(cellarId)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result ? result.totalAssetsWithdrawable : undefined
  } catch (error) {
    console.log("Error fetching Cellar Redeemable Assets", error)
    throw Error(error as string)
  }
}
