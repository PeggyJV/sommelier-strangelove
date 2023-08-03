const getUrl = (epoch: number, cellarAddress: string) =>
  `/api/graph-weekly-share-value-data?epoch=${epoch}&cellarAddress=${cellarAddress}`

export const fetchWeeklyShareValueData = async (
  epoch: number,
  cellarAddress: string
) => {
  const url = getUrl(epoch, cellarAddress)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log(
      "Error fetching Graph Weekly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
