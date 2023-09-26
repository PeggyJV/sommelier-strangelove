const getUrl = () =>
  `/api/sommelier-api-all-strategies-data`

export const fetchCellarStrategyData = async () => {
  const url = getUrl()

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result
  } catch (error) {
    console.log("Error fetching Aggregate Cellar Strategy Data", error)
    throw Error(error as string)
  }
}
