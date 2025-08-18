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

export const fetchCellarStrategyData = async () => {
  const url = getUrl()

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result
  } catch (error) {
    console.log(
      "Error fetching Aggregate Cellar Strategy Data",
      error
    )
    throw Error(error as string)
  }
}
