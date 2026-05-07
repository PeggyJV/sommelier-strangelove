import { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { queryContract } from "context/rpc_context"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

type LiquidityStateContract = {
  read: {
    totalAssets: () => Promise<bigint | string>
    totalAssetsWithdrawable: () => Promise<bigint | string>
  }
}

const cellarLiquidityState = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarId } = req.query
    cellarId = cellarId as string

    if (!cellarId || !cellarDataMap[cellarId]) {
      res.status(400).send({
        error: "missing or unknown cellar id",
        message: "missing or unknown cellar id",
      })
      return
    }

    const cellar = (await queryContract(
      cellarDataMap[cellarId].config.id,
      cellarDataMap[cellarId].config.cellar.abi,
      cellarDataMap[cellarId].config.chain
    )) as LiquidityStateContract | null

    if (!cellar) {
      throw new Error("failed to load contract")
    }

    const [totalAssets, totalAssetsWithdrawable] = await Promise.all([
      cellar.read.totalAssets(),
      cellar.read.totalAssetsWithdrawable(),
    ])

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=120"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      totalAssets: String(totalAssets),
      totalAssetsWithdrawable: String(totalAssetsWithdrawable),
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({
      error: "failed to fetch data",
      message:
        (error as Error).message || "An unknown error occurred",
    })
  }
}

export default cellarLiquidityState
