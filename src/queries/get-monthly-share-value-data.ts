const getUrl = (epoch: number, cellarAddress: string) =>
  `/api/graph-monthly-share-value-data?epoch=${epoch}&cellarAddress=${cellarAddress}`

export const fetchMonthlyShareValueData = async (
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
      "Error fetching Graph Monthly Share Value Data",
      error
    )
    throw Error(error as string)
  }
}
