const getUrl = (epoch: number, cellarAddress: string) =>
  `/api/sommelier-api-monthly-share-value-data?epoch=${epoch}&cellarAddress=${cellarAddress}&chain=${chain}`

export const fetchMonthlyShareValueData = async (
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
      "Error fetching Monthly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
