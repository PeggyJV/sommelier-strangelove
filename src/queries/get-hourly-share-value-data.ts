const getUrl = (epoch: number, cellarAddress: string, chain: string) =>
  `/api/sommelier-api-hourly-share-value-data?epoch=${epoch}&cellarAddress=${cellarAddress}&chain=${chain}`

export const fetchHourlyShareValueData = async (
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
      "Error fetching hourly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
