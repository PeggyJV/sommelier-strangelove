import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("x-somm-attrib-enabled", "false")
  if (req.method !== "POST") return res.status(405).end()
  return res.status(200).json({ ok: true, disabled: true, count: 0 })
}
