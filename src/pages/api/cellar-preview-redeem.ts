import { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { queryContract } from "context/rpc_context"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const cellarPreviewRedeem = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarId, shares } = req.query
    cellarId = cellarId as string
    const sharesNum: BigInt = shares as unknown as BigInt

    if (!cellarId || !sharesNum) {
      res.status(400).send({
        error: "missing cellar id or shares",
        message: "missing cellar id or shares",
      })
      return
    }

    const cellar = await queryContract(
      cellarDataMap[cellarId]?.config.id,
      cellarDataMap[cellarId]?.config.cellar.abi,
      cellarDataMap[cellarId]?.config.chain
    )

    let shareValue: number = 0

    if (cellar) {
      shareValue = await cellar.read.previewRedeem([sharesNum]) as unknown as number
    } else {
      throw new Error("failed to load contract")
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=120"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      sharesValue: shareValue.toString(), // Convert the result to string to ensure it can be serialized in JSON
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({
        error: "failed to fetch data",
        message:
          (error as Error).message || "An unknown error occurred",
      })
  }
}

export default cellarPreviewRedeem
