import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end()

  const format = (req.query.format as string) || "csv"
  res.setHeader("x-somm-kv-source", "DISABLED")

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="rpc-report-disabled.csv"'
    )
    return res.send(
      "timestampMs,txHash,contractAddress,wallet,domain,pagePath,method,stage,amount,status\n"
    )
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  return res.json([])
}
