import { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { queryContract } from "context/rpc_context"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"


const cellarRedeemableAssets = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarId } = req.query
    cellarId = cellarId as string

    if (!cellarId) {
      res.status(400).send({
        error: "missing cellar id",
        message: "missing cellar id",
      })
      return
    }

    const cellar = await queryContract(
      cellarDataMap[cellarId]?.config.id,
      cellarDataMap[cellarId]?.config.cellar.abi
    )

    let totalAssets: string = ""; 

    if (cellar) {
      totalAssets = await cellar.totalAssetsWithdrawable()
    } else {
      throw new Error("failed to load contract")
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=120"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      totalAssetsWithdrawable: totalAssets.toString(), // Convert the result to string to ensure it can be serialized in JSON
    })
  } catch (error) {
    res
      .status(500)
      .send({ error: "failed to fetch data", message: error })
  }
}

export default cellarRedeemableAssets
