import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  return res.status(503).json({
    disabled: true,
    message: "Snapshot registration is temporarily unavailable.",
  })
}
