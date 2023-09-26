const getUrl = (cellarAddress: string) =>
  `/api/sommelier-api-individual-strat-data?cellarAddress=${cellarAddress}`

export const fetchIndividualCellarStrategyData = async (cellarAddress: string) => {
  const url = getUrl(cellarAddress)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result
  } catch (error) {
    console.log(
      "Error fetching Individual Cellar Strategy Data",
      error
    )
    throw Error(error as string)
  }
}
