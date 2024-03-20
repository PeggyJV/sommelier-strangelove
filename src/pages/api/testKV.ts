// pages/api/testKV.js
import { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test key and value
    const testKey = "testKey"
    const testValue = { message: "Hello, Vercel KV!" }

    // Set a test value
    await kv.set(testKey, JSON.stringify(testValue))

    // Retrieve the test value
    const value = await kv.get(testKey)

    // If value is null, it means the key was not found or not set properly
    if (value === null) {
      throw new Error(
        "Failed to retrieve the value from Vercel KV. Key may not exist or be set correctly."
      )
    }

    // Send the retrieved value as the response
    res.status(200).json({ testValue: JSON.parse(value) })
  } catch (error) {
    console.error("KV interaction error:", error)
    res
      .status(500)
      .json({
        error: "Failed to interact with Vercel KV.",
        details: error.message,
      })
  }
}
