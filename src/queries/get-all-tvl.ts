const getUrl = () => `/api/sommelier-api-tvl`
const DEBUG_FETCH = process.env.NEXT_PUBLIC_DEBUG_FETCH === "1"

export const fetchTVLData = async () => {
  const url = getUrl()

  try {
    const data = await fetch(url)
    const result = await data.json()

    if (DEBUG_FETCH) {
      const keys = Object.keys(result?.result?.data ?? {})
      console.log("[tvl] fetch", {
        url,
        status: data.status,
        cellarCount: Math.max(keys.length - 1, 0), // minus total_tvl
        total: result?.result?.data?.total_tvl,
      })
    }

    return result.result.data
  } catch (error) {
    console.log("Error fetching TVL Data", error)
    throw Error(error as string)
  }
}
