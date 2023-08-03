const getUrl = (cellarAddress: string) =>
  `/api/graph-monthly-share-value-data?cellarAddress=${cellarAddress}`

export const fetchMonthlyShareValueData = async (
  cellarAddress: string
) => {
  const url = getUrl(cellarAddress)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result
  } catch (error) {
    console.log(
      "Error fetching Graph Monthly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
