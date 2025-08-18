import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

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

    // Append to perf/vitals.log for local analysis
    try {
      const outDir = path.join(process.cwd(), "perf")
      if (!fs.existsSync(outDir))
        fs.mkdirSync(outDir, { recursive: true })
      const line = JSON.stringify({
        name,
        value,
        id,
        page,
        userAgent,
        timestamp: new Date().toISOString(),
      })
      fs.appendFileSync(path.join(outDir, "vitals.log"), line + "\n")
    } catch {}
  } catch {}

  res.status(200).json({ success: true })
}
