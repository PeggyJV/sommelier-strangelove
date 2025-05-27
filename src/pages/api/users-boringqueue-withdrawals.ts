import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const usersBoringQueueWithdrawals = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { vaultAddress, userAddress, chain } = req.query
    const data = await fetch(
        `https://api.sevenseas.capital/boringQueue/${chain}/${vaultAddress}/${userAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        }
      )

    if (data.status !== 200) {
      throw new Error("failed to fetch data")
    }

    const fetchedData = await data.json()

    const formattedResult = {
      result: { data: fetchedData.Response },
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json(formattedResult)
  } catch (error) {
    console.error(error)
    res.status(500).send({
      error: "failed to fetch data",
      message:
        (error as Error).message || "An unknown error occurred",
    })
  }
}

export default usersBoringQueueWithdrawals
