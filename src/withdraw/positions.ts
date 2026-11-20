import type { Address, PublicClient } from "viem"
import { errorText } from "./tx"
import { cellarAbi, erc20Abi, stakerAbi, withdrawQueueAbi, boringQueueAbi } from "./abis"
import { ALPHA_STETH_ASSETS_OUT, ALPHA_STETH_QUEUE, VAULTS, WITHDRAW_QUEUE, type ChainId, type Vault } from "./vaults"

export type Stake = {
  id: number
  amount: bigint
  unbondTimestamp: number // 0 = still bonded; otherwise the unix time unstaking unlocks
}

export type StakeState = {
  stakes: Stake[]
  ended: boolean // owner called emergencyStop: emergencyUnstake works immediately
  claimable: boolean // ended with rewards claimable: emergencyClaim pays earned SOMM
  paused: boolean
  hasRewards: boolean // any stake record (even fully unstaked) with recorded rewards
}

export type QueueAsset = {
  symbol: string
  address: Address
  allowWithdraws: boolean
  minimumSecondsToDeadline: number
  minDiscount: number
  previewOut?: bigint
  decimals: number
}

export type Position = {
  vault: Vault
  shareDecimals: number
  assetSymbol: string
  assetDecimals: number
  walletShares: bigint
  walletValue?: bigint // previewRedeem(walletShares), in asset units
  maxRedeem?: bigint // shares redeemable right now (liquidity-limited)
  redeemShares: bigint // what the Withdraw button redeems: the full balance, or the liquid part
  redeemError?: string // why a redeem of maxRedeem would fail, from an eth_call
  stake?: StakeState
  stakedShares: bigint
  queueRequestShares: bigint // open request in the old v0.8.21 withdraw queue
  boring?: { paused: boolean; assets: QueueAsset[] }
  readWarnings: string[] // reads that failed, so the user is not shown a falsely empty state
}

// Reads every vault on one chain for one user. Two multicall rounds plus one eth_call per
// vault the user actually holds (to check that redeem would go through).
export async function loadChainPositions(client: PublicClient, chainId: ChainId, user: Address): Promise<Position[]> {
  const vaults = VAULTS.filter((v) => v.chainId === chainId)

  const first = await client.multicall({
    allowFailure: true,
    contracts: vaults.flatMap((v) => [
      { address: v.address, abi: cellarAbi, functionName: "balanceOf", args: [user] },
      { address: v.address, abi: cellarAbi, functionName: "decimals" },
      { address: v.address, abi: cellarAbi, functionName: "asset" },
      v.staker
        ? { address: v.staker, abi: stakerAbi, functionName: "getUserStakes", args: [user] }
        : { address: v.address, abi: cellarAbi, functionName: "decimals" },
      v.staker
        ? { address: v.staker, abi: stakerAbi, functionName: "ended" }
        : { address: v.address, abi: cellarAbi, functionName: "decimals" },
      v.staker
        ? { address: v.staker, abi: stakerAbi, functionName: "paused" }
        : { address: v.address, abi: cellarAbi, functionName: "decimals" },
      v.staker
        ? { address: v.staker, abi: stakerAbi, functionName: "claimable" }
        : { address: v.address, abi: cellarAbi, functionName: "decimals" },
      { address: WITHDRAW_QUEUE[chainId], abi: withdrawQueueAbi, functionName: "getUserWithdrawRequest", args: [user, v.address] },
    ]),
  })
  const N = 8

  const rows = vaults.map((vault, i) => {
    const r = first.slice(i * N, i * N + N)
    const walletShares = (r[0].result as bigint | undefined) ?? 0n
    const shareDecimals = Number(r[1].result ?? 18)
    const asset = r[2].result as Address | undefined
    let stake: StakeState | undefined
    let stakedShares = 0n
    const readWarnings: string[] = []
    if (r[0].status !== "success") readWarnings.push("Could not read your share balance.")
    if (vault.staker) {
      if (r[3].status === "success" && r[4].status === "success" && r[5].status === "success") {
        const raw = r[3].result as unknown as readonly { amount: bigint; unbondTimestamp: number; rewards: bigint }[]
        const stakes = raw
          .map((s, id) => ({ id, amount: BigInt(s.amount), unbondTimestamp: Number(s.unbondTimestamp) }))
          .filter((s) => s.amount > 0n)
        stakedShares = stakes.reduce((a, s) => a + s.amount, 0n)
        stake = {
          stakes,
          ended: Boolean(r[4].result),
          paused: Boolean(r[5].result),
          claimable: r[6].status === "success" && Boolean(r[6].result),
          hasRewards: raw.some((s) => BigInt(s.rewards) > 0n),
        }
      } else {
        readWarnings.push("Could not read your staked position. Refresh to try again.")
      }
    }
    const req = r[7].result as { sharesToWithdraw: bigint } | undefined
    return {
      vault, walletShares, shareDecimals, asset, stake, stakedShares, readWarnings,
      queueRequestShares: req ? BigInt(req.sharesToWithdraw) : 0n,
    }
  })

  // The Alpha stETH row is always kept: shares sitting in a pending queue request have left the
  // wallet, and the card still has to show that request so it can be cancelled.
  const held = rows.filter(
    (r) =>
      r.walletShares > 0n ||
      r.stakedShares > 0n ||
      r.queueRequestShares > 0n ||
      r.readWarnings.length > 0 ||
      (r.stake?.ended && r.stake.claimable && r.stake.hasRewards) ||
      r.vault.kind === "boring"
  )
  if (held.length === 0) return []

  const second = await client.multicall({
    allowFailure: true,
    contracts: held.flatMap((r) => {
      const assetAddr = (r.asset ?? r.vault.address) as Address
      return [
        { address: assetAddr, abi: erc20Abi, functionName: "symbol" },
        { address: assetAddr, abi: erc20Abi, functionName: "decimals" },
        { address: r.vault.address, abi: cellarAbi, functionName: "previewRedeem", args: [r.walletShares + r.stakedShares] },
        { address: r.vault.address, abi: cellarAbi, functionName: "maxRedeem", args: [user] },
      ]
    }),
  })

  const out: Position[] = []
  for (const [i, r] of held.entries()) {
    const s = second.slice(i * 4, i * 4 + 4)
    const pos: Position = {
      vault: r.vault,
      shareDecimals: r.shareDecimals,
      assetSymbol: (s[0].result as string | undefined) ?? "?",
      assetDecimals: Number(s[1].result ?? 18),
      walletShares: r.walletShares,
      walletValue: s[2].result as unknown as bigint | undefined,
      maxRedeem: s[3].status === "success" ? (s[3].result as unknown as bigint) : undefined,
      stake: r.stake,
      stakedShares: r.stakedShares,
      queueRequestShares: r.queueRequestShares,
      redeemShares: 0n,
      readWarnings: r.readWarnings,
    }

    if (r.vault.kind === "boring") {
      try {
        pos.boring = await loadBoring(client, r.walletShares)
      } catch (e) {
        // Never let an Alpha stETH read failure hide the user's other Ethereum positions.
        pos.boring = { paused: true, assets: [] }
        pos.readWarnings.push(`Could not read the Alpha stETH queue: ${errorText(e)}`)
      }
      pos.assetSymbol = "stETH"
      pos.assetDecimals = 18
      pos.walletValue = pos.boring.assets.find((a) => a.symbol === "stETH")?.previewOut
      pos.maxRedeem = undefined
    } else if (r.walletShares > 0n) {
      // maxRedeem can round a few wei under the balance; within 0.1% we redeem everything so no
      // dust is left behind, and the simulation below decides whether that goes through.
      const nearFull = pos.maxRedeem === undefined || pos.maxRedeem * 1000n >= r.walletShares * 999n
      const candidates = nearFull ? [r.walletShares] : [pos.maxRedeem!]
      // If the full balance fails but maxRedeem is a little lower, fall back to maxRedeem.
      if (nearFull && pos.maxRedeem !== undefined && pos.maxRedeem > 0n && pos.maxRedeem < r.walletShares) {
        candidates.push(pos.maxRedeem)
      }
      if (candidates[0] === 0n) {
        pos.redeemError = "No liquidity available to redeem right now"
      } else {
        for (const shares of candidates) {
          try {
            await client.simulateContract({
              account: user,
              address: r.vault.address,
              abi: cellarAbi,
              functionName: "redeem",
              args: [shares, user, user],
            })
            pos.redeemShares = shares
            pos.redeemError = undefined
            break
          } catch (e) {
            pos.redeemError ??= errorText(e)
          }
        }
      }
    }
    out.push(pos)
  }
  return out
}

async function loadBoring(client: PublicClient, shares: bigint): Promise<{ paused: boolean; assets: QueueAsset[] }> {
  const paused = await client.readContract({ address: ALPHA_STETH_QUEUE, abi: boringQueueAbi, functionName: "isPaused" })
  const res = await client.multicall({
    allowFailure: true,
    contracts: ALPHA_STETH_ASSETS_OUT.map((a) => ({
      address: ALPHA_STETH_QUEUE,
      abi: boringQueueAbi,
      functionName: "withdrawAssets" as const,
      args: [a.address] as const,
    })),
  })
  const assets: QueueAsset[] = ALPHA_STETH_ASSETS_OUT.map((a, i) => {
    const w = res[i].result as readonly [boolean, number, number, number, number, bigint] | undefined
    return {
      symbol: a.symbol,
      address: a.address,
      allowWithdraws: Boolean(w?.[0]),
      minimumSecondsToDeadline: Number(w?.[2] ?? 0),
      minDiscount: Number(w?.[3] ?? 0),
      decimals: 18,
    }
  })
  if (shares > 0n) {
    const previews = await client.multicall({
      allowFailure: true,
      contracts: assets.map((a) => ({
        address: ALPHA_STETH_QUEUE,
        abi: boringQueueAbi,
        functionName: "previewAssetsOut" as const,
        args: [a.address, shares, a.minDiscount] as const,
      })),
    })
    previews.forEach((p, i) => {
      if (p.status === "success") assets[i].previewOut = p.result as bigint
    })
  }
  return { paused, assets }
}

// Open Alpha stETH queue requests come from the Seven Seas indexer through our API route,
// since public RPCs refuse the archive-range log query needed to rebuild them on-chain.
// Each one is checked against the queue's on-chain request ids, so only a request that will
// actually cancel is offered.
export type BoringRequest = {
  verified: boolean // rebuilt struct hashes to a live on-chain request id, so cancel will work
  nonce: bigint
  user: Address
  assetOut: Address
  amountOfShares: bigint
  amountOfAssets: bigint
  creationTime: number
  secondsToMaturity: number
  secondsToDeadline: number
}

// The indexer returns uint128 amounts as bare JSON numbers; quote long integers before
// parsing so they survive as exact strings instead of lossy doubles.
// Exact for integers; an exponent-form value (already rounded upstream) still parses, but its
// rebuilt request will not match on-chain and is shown as unverified.
const toBig = (x: unknown): bigint => {
  try {
    return BigInt(String(x))
  } catch {
    return BigInt(Math.round(Number(x)))
  }
}

const parseExact = (text: string) => JSON.parse(text.replace(/([:\[,]\s*)(-?\d{15,})(?=\s*[,}\]])/g, '$1"$2"'))

// The on-chain OnChainWithdraw struct, without our UI-only fields.
export const strip = ({ verified: _v, ...q }: BoringRequest) => q

export async function loadBoringRequests(client: PublicClient, vault: Address, user: Address): Promise<BoringRequest[]> {
  const r = await fetch(`/api/users-boringqueue-withdrawals?vaultAddress=${vault}&userAddress=${user}`)
  if (!r.ok) throw new Error(`queue indexer returned ${r.status}`)
  const j = parseExact(await r.text())
  const open = (j?.Response?.open_requests ?? []) as { metadata: Record<string, unknown> }[]
  const reqs: BoringRequest[] = open.map(({ metadata: m }) => ({
    verified: false,
    nonce: toBig(m.nonce),
    user: m.user as Address,
    assetOut: m.assetOut as Address,
    amountOfShares: toBig(m.amountOfShares),
    amountOfAssets: toBig(m.amountOfAssets),
    creationTime: Number(m.creationTime),
    secondsToMaturity: Number(m.secondsToMaturity),
    secondsToDeadline: Number(m.secondsToDeadline),
  }))
  if (reqs.length === 0) return []
  const ids = await client.readContract({ address: ALPHA_STETH_QUEUE, abi: boringQueueAbi, functionName: "getRequestIds" })
  const mine = await client.multicall({
    allowFailure: false,
    contracts: reqs.map((q) => ({ address: ALPHA_STETH_QUEUE, abi: boringQueueAbi, functionName: "getRequestId" as const, args: [strip(q)] as const })),
  })
  const live = new Set(ids.map((x) => x.toLowerCase()))
  // Unverified requests are still shown (with a warning) so queued shares never vanish from view.
  return reqs.map((q, i) => ({ ...q, verified: live.has(String(mine[i]).toLowerCase()) }))
}
