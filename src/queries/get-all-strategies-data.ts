const getUrl = () =>
  `/api/graph-cellar-strategy-data`

export const fetchGraphCellarStrategyData = async (
) => {
  const url = getUrl()

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result
  } catch (error) {
    console.log("Error fetching Graph Aggregate Cellar Strategy Data", error)
    throw Error(error as string)
  }
}
