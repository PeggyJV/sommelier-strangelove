import { NextApiRequest, NextApiResponse } from "next"

import { query, baseUrl, GRAPH_URL } from "./subgraph-status-block"

export default async function getSubgraphStatusBlock(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "public, maxage=60, s-maxage=60")
  res.setHeader("Access-Control-Allow-Origin", baseUrl)

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
    const hasErrors = result.hasIndexingErrors
    const payload = { hasErrors }

    if (hasErrors) {
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
