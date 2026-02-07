const getUrl = () => {
  // Use absolute URL when running on the server (API routes, SSR)
  if (typeof window === "undefined") {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    return `${base}/api/sommelier-api-all-strategies-data`
  }
  // Relative URL in the browser
  return `/api/sommelier-api-all-strategies-data`
}

const DEBUG_FETCH = process.env.NEXT_PUBLIC_DEBUG_FETCH === "1"

export const fetchCellarStrategyData = async () => {
  const url = getUrl()

  try {
    const data = await fetch(url)

    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`)
    }

    const result = await data.json()
    if (DEBUG_FETCH) {
      const count = result?.result?.data?.cellars?.length ?? 0
      console.log("[strategies] fetch", {
        url,
        status: data.status,
        count,
      })
    }

    return result.result
  } catch (error) {
    console.warn(
      "Error fetching Aggregate Cellar Strategy Data",
      error
    )
    // Return a default structure instead of throwing
    return {
      data: {
        cellars: [],
      },
    }
  }
}
