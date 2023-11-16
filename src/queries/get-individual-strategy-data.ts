const getUrl = (cellarAddress: string, chain: string) =>
  `/api/sommelier-api-individual-strat-data?cellarAddress=${cellarAddress}&chain=${chain}`

export const fetchIndividualCellarStrategyData = async (
  cellarAddress: string,
  chain: string
) => {
  const url = getUrl(cellarAddress, chain)

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
