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

    // Send the retrieved value as the response
    res.status(200).json({ testValue: JSON.parse(value) })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: "Failed to interact with Vercel KV." })
  }
}
