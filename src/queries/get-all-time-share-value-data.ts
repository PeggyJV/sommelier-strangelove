const getUrl = (cellarAddress: string) =>
  `/api/sommelier-api-all-time-share-value-data?cellarAddress=${cellarAddress}`

export const fetchAllTimeShareValueData = async (
  cellarAddress: string
) => {
  const url = getUrl(cellarAddress)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log(
      "Error fetching Graph All Time Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
