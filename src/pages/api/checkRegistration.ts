// /pages/api/checkRegistration.ts
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  const { ethAddress, sommAddress } = req.body

  const existingSommRegistration = await kv.get(`somm:${sommAddress}`)
  const existingEthRegistration = await kv.get(`eth:${ethAddress}`)

  if (existingSommRegistration || existingEthRegistration) {
    let message =
      "One or both of your addresses are already registered."
    // You can customize the message further based on which addresses are registered
    return res.status(409).json({ message })
  }

  return res
    .status(200)
    .json({ message: "Addresses are not registered." })
}
