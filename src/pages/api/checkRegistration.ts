import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  return res.status(503).json({
    disabled: true,
    message: "Registration lookup is temporarily unavailable.",
  })
}
