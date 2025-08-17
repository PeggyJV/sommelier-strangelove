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
    const cellarConfig = cellarDataMap[cellarId]?.config;
    let address;
    let abi;
    let chain;

    if (cellarConfig.boringQueue) {
      address = cellarConfig.boringQueue.address
      abi = cellarConfig.boringQueue.abi
      chain = cellarConfig.chain
    } else {
      address = cellarConfig.cellar.address
      abi = cellarConfig.cellar.abi
      chain = cellarConfig.chain
    }

    const contract = await queryContract(address, abi, chain)

    let shareValue = 0
    if (!contract) throw new Error("failed to load contract")
    try {
      if (cellarConfig.boringQueue) {
        // previewAssetsOut for boring queue
        shareValue = (await contract.read.previewAssetsOut([
          cellarConfig.baseAsset.address,
          sharesNum,
          0,
        ])) as unknown as number
      } else {
        // legacy previewRedeem
        shareValue = (await contract.read.previewRedeem([
          sharesNum,
        ])) as unknown as number
      }
    } catch (e) {
      // Return safe default instead of crashing
      shareValue = 0 as number
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=120"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      sharesValue: shareValue.toString(),
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
