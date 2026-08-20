const getUrl = (cellarAddress: string, chain: string) =>
  `/api/sommelier-api-individual-strat-data?cellarAddress=${cellarAddress}&chain=${chain}`

/**
 * The API returns one of two shapes:
 *   healthy  -> { result: { data: { cellar: {...} } } }
 *   degraded -> { status: "data_pending", note: "...", ... }
 *
 * The degraded shape has no `result` key. Callers destructure the return value
 * as `{ data, error }`, so returning `undefined` here throws a TypeError and
 * leaves the strategy page stuck on its loading skeleton forever. Always hand
 * back a destructurable object.
 */
export const fetchIndividualCellarStrategyData = async (
  cellarAddress: string,
  chain: string
) => {
  const url = getUrl(cellarAddress, chain)

  try {
    const response = await fetch(url)
    const payload = await response.json()

    return payload?.result ?? {}
  } catch (error) {
    console.log(
      "Error fetching Individual Cellar Strategy Data",
      error
    )
    throw Error(error as string)
  }
}
