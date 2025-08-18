import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, value, id, page, userAgent } = req.body || {}
    console.log("[WebVitals]", {
      name,
      value,
      id,
      page,
      userAgent,
      timestamp: new Date().toISOString(),
    })
  } catch {}

  res.status(200).json({ success: true })
}
