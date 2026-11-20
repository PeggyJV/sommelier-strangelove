import type { NextApiRequest, NextApiResponse } from "next"

// Proxies the Seven Seas BoringQueue indexer for Alpha stETH. The body is passed through as
// text so uint128 amounts are not rounded by a JSON round-trip.
const ADDR = /^0x[0-9a-fA-F]{40}$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { vaultAddress, userAddress } = req.query
  if (typeof vaultAddress !== "string" || !ADDR.test(vaultAddress) || typeof userAddress !== "string" || !ADDR.test(userAddress)) {
    res.status(400).json({ error: "vaultAddress and userAddress must be addresses" })
    return
  }
  try {
    const upstream = await fetch(`https://api.sevenseas.capital/boringQueue/ethereum/${vaultAddress}/${userAddress}`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`)
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300")
    res.setHeader("Content-Type", "application/json")
    res.status(200).send(await upstream.text())
  } catch (e) {
    res.status(502).json({ error: "queue indexer unavailable", message: (e as Error).message })
  }
}
