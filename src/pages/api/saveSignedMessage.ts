//Users/henriots/Desktop/sommelier-strangelove/src/pages/api/saveSignedMessage.ts
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"
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

    // Ensure all required fields are present, including the 'data' field now
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

    // Reconstruct the message using known valid fields
    const reconstructedMessage = JSON.stringify({
      ethAddress,
      sommAddress,
    })

    // Decode the public key and signature from Base64
    const decodedPubKey = Buffer.from(pubKey, "base64")
    const decodedSignature = Buffer.from(signature, "base64")

    // Verify the signature against the reconstructed message
    const isValidSignature = await verifyADR36Amino(
      "somm", // Your chain's Bech32 prefix
      sommAddress,
      reconstructedMessage, // Use the reconstructed message for verification
      decodedPubKey,
      decodedSignature,
      "secp256k1" // The signing algorithm used, adjust if necessary
    )

    if (!isValidSignature) {
      return res.status(401).json({ message: "Invalid signature." })
    }

    // Save data after successful validation, including the 'data' field
    await kv.set(
      `somm:${sommAddress}`,
      JSON.stringify({ ethAddress, signature, data }) // 'data' is included here
    )
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
