// pages/api/saveSignedMessage.ts
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { sommAddress, ethAddress, signature } = req.body

    // TODO: Validate the signature here

    // Assuming validation is successful, save to KV database
    // Key is somm address and data is eth address
    await kv.set(`somm:${sommAddress}`, ethAddress)
    // Key is eth address and path is somm address
    await kv.set(`eth:${ethAddress}`, sommAddress)

    return res
      .status(200)
      .json({ message: "Data saved successfully" })
  } else {
    // Handle any other HTTP methods as needed
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
