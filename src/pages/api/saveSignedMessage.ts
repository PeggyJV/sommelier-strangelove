//src/pages/api/saveSignedMessage.ts
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv" /
import { verifyADR36Amino } from "@keplr-wallet/cosmos/build/adr-36/amino"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    // If not POST, inform the client which methods are allowed
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const { sommAddress, ethAddress, signature, pubKey, data } =
      req.body

    // Perform input validation (ensure all required fields are present)
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

    // Decode pubKey and signature from base64
    const decodedPubKey = Buffer.from(pubKey, "base64")
    const decodedSignature = Buffer.from(signature, "base64")

    // Verify the signature
    const isValidSignature = await verifyADR36Amino(
      "somm", // Adjust the Bech32 prefix for your chain accordingly
      sommAddress, // Signer address
      data, // The data that was signed
      decodedPubKey, // Public key of the signer
      decodedSignature, // Signature
      "secp256k1" // Algorithm, adjust if necessary
    )

    if (!isValidSignature) {
      return res.status(401).json({ message: "Invalid signature." })
    }

    // Proceed with saving data after successful validation
    await kv.set(`somm:${sommAddress}`, ethAddress)
    await kv.set(`eth:${ethAddress}`, sommAddress)

    return res
      .status(200)
      .json({ message: "Data saved successfully." })
  } catch (error: unknown) {
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
