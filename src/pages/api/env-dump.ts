import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development")
    return res.status(404).end()

  const url = process.env.ATTRIB_KV_KV_REST_API_URL || ""
  const tokenPresent = !!process.env.ATTRIB_KV_KV_REST_API_TOKEN
  let host = ""
  try {
    host = url ? new URL(url).host : ""
  } catch {}

  res.setHeader("content-type", "application/json; charset=utf-8")
  res.json({
    effectiveKvUrl: url,
    effectiveKvHost: host,
    ATTRIB_KV_KV_REST_API_URL_present: !!url,
    ATTRIB_KV_KV_REST_API_TOKEN_present: tokenPresent,
  })
}
