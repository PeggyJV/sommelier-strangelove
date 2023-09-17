const getUrl = () => `/api/sommelier-api-tvl`

export const fetchTVLData = async () => {
  const url = getUrl()

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log("Error fetching TVL Data", error)
    throw Error(error as string)
  }
}
