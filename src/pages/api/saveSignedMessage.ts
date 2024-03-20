import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv" // Ensure @vercel/kv is configured correctly
import { verifyADR36Amino } from "@keplr-wallet/cosmos"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const { sommAddress, ethAddress, signature, pubKey, data } =
      req.body

    if (
      !sommAddress ||
      !ethAddress ||
      !signature ||
      !pubKey ||
      !data
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields." })
    }

    const decodedPubKey = Buffer.from(pubKey, "base64")
    const decodedSignature = Buffer.from(signature, "base64")

    const isValidSignature = await verifyADR36Amino(
      "somm",
      sommAddress,
      data,
      decodedPubKey,
      decodedSignature,
      "secp256k1"
    )

    if (!isValidSignature) {
      return res.status(401).json({ message: "Invalid signature." })
    }

    await kv.set(`somm:${sommAddress}`, ethAddress)
    await kv.set(`eth:${ethAddress}`, sommAddress)

    return res
      .status(200)
      .json({ message: "Data saved successfully." })
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred"
    console.error("Error handling saveSignedMessage:", errorMessage)
    return res.status(500).json({
      message: "Internal server error",
      error: errorMessage,
    })
  }
}
