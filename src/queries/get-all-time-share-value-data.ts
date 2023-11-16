const getUrl = (cellarAddress: string) =>
  `/api/sommelier-api-all-time-share-value-data?cellarAddress=${cellarAddress}&chain=${chain}`

export const fetchAllTimeShareValueData = async (
  cellarAddress: string,
  chain: string
) => {
  const url = getUrl(cellarAddress, chain)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log(
      "Error fetching All Time Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
