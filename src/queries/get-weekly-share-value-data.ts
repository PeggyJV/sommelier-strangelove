const getUrl = (epoch: number, cellarAddress: string, chain: string) =>
  `/api/sommelier-api-weekly-share-value-data?epoch=${epoch}&cellarAddress=${cellarAddress}&chain=${chain}`

export const fetchWeeklyShareValueData = async (
  epoch: number,
  cellarAddress: string,
  chain: string
) => {
  const url = getUrl(epoch, cellarAddress, chain)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log(
      "Error fetching Weekly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
