import { NextApiRequest, NextApiResponse } from "next"
import { getActiveProvider } from "context/rpc_context"

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const GRAPH_URL =
  process.env.NEXT_PUBLIC_GRAPH_ENDPOINT ??
  "https://subgraphs.sommelier.finance/subgraphs/name/peggyjv/cellars"
const threshold = process.env.SUBGRAPH_BLOCK_THRESHOLD || "50"
const THRESHOLD = parseInt(threshold, 10)

export const query = `
  {
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`

export default async function getSubgraphStatusBlock(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "public, maxage=60, s-maxage=60")
  res.setHeader("Access-Control-Allow-Origin", baseUrl)

  const provider = await getActiveProvider()
  if (provider == null) {
    return res
      .status(500)
      .send("Failed to fetch block height, provider is null")
  }

  let blockHeight = 0
  try {
    blockHeight = await provider.getBlockNumber()
  } catch (e) {
    return res.status(500).send("Failed to fetch block height")
  }

  try {
    const data = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })

    const result = (await data.json()).data._meta
    const currentBlock = result.block.number
    const diff = blockHeight - currentBlock

    const payload = {
      blockHeight,
      currentBlock,
      diff,
    }

    if (diff > THRESHOLD) {
      return res.status(400).send(payload)
    }

    return res.json(payload)
  } catch (e) {
    console.log("ERROR: ", e)
    return res
      .status(500)
      .send(`Failed to fetch Subgraph status: ${GRAPH_URL}`)
  }
}
