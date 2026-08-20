import { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { queryContract } from "context/rpc_context"
import { WITHDRAWALS_PAUSED_SLUGS } from "data/withdrawalsPaused"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

type PreviewRedeemContract = {
  read: {
    previewRedeem: (args: [bigint]) => Promise<bigint | string>
  }
}

/**
 * Live probe for whether a vault can actually be redeemed from.
 *
 * `previewRedeem` walks the same accounting path as `redeem`, so if the share
 * price oracle is stale it reverts with `Cellar__OracleFailure()` exactly like
 * a real withdrawal would. That makes it a truthful, self-clearing signal: the
 * moment governance points the cellar at a healthy oracle, this starts
 * answering and the outage banner disappears on its own.
 *
 * Only vaults on the watch list are probed - there is no reason to spend an
 * RPC call per page view on vaults that were never affected.
 */
const withdrawalStatus = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const cellarId = req.query.cellarId as string | undefined

  res.setHeader(
    "Cache-Control",
    "public, maxage=60, s-maxage=60, stale-while-revalidate=300"
  )
  res.setHeader("Access-Control-Allow-Origin", baseUrl)

  if (!cellarId || !cellarDataMap[cellarId]) {
    return res.status(400).json({
      error: "missing or unknown cellar id",
    })
  }

  if (!WITHDRAWALS_PAUSED_SLUGS.includes(cellarId)) {
    return res
      .status(200)
      .json({ cellarId, paused: false, reason: "not_watched" })
  }

  const { config } = cellarDataMap[cellarId]

  try {
    const cellar = (await queryContract(
      config.id,
      config.cellar.abi,
      config.chain
    )) as PreviewRedeemContract | null

    if (!cellar) {
      // Cannot tell. Keep the warning up rather than silently implying that a
      // known-broken vault is withdrawable.
      return res.status(200).json({
        cellarId,
        paused: true,
        reason: "probe_unavailable",
      })
    }

    await cellar.read.previewRedeem([
      BigInt(10) ** BigInt(config.cellar.decimals ?? 18),
    ])

    return res
      .status(200)
      .json({ cellarId, paused: false, reason: "redeemable" })
  } catch (error) {
    // previewRedeem reverted - the same revert a user's withdrawal would hit.
    return res
      .status(200)
      .json({ cellarId, paused: true, reason: "reverts" })
  }
}

export default withdrawalStatus
