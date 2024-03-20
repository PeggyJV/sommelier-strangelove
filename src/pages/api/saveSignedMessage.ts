// In saveSignedMessage.ts
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"
import { verifyADR36Amino } from "utils/adr36Verification"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { sommAddress, ethAddress, signature, pubKey, data } =
        req.body

      // Assuming the Amino message and signature are provided in the request.
      // You'll need to construct or extract the Amino message properly
      // Here we assume `data` is your Amino message

      // Verification logic
      const isValidSignature = verifyADR36Amino(
        "somm", // Bech32 prefix for your chain
        sommAddress, // Signer address
        data, // The data that was signed
        Buffer.from(pubKey, "base64"), // Public key of the signer
        Buffer.from(signature, "base64"), // Signature
        "secp256k1" // Algorithm
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
    } catch (error) {
      console.error("API Error:", error)
      return res
        .status(500)
        .json({
          message: "Internal server error",
          error: error.message,
        })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end("Method Not Allowed")
  }
}
