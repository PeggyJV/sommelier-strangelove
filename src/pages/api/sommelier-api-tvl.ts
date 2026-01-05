import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const DEBUG_FETCH = process.env.NEXT_PUBLIC_DEBUG_FETCH === "1"

type DailyDataResponse = {
  Response: Record<
    string,
    Array<{
      unix_seconds?: number
      tvl?: number | string
    }>
  >
}

const fetchJson = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const body = await res.json()
  return { ok: res.ok, status: res.status, body }
}

const getLatestTvl = (
  data: DailyDataResponse | undefined,
  addr: string
) => {
  const entries = data?.Response?.[addr]
  if (!Array.isArray(entries) || entries.length === 0) return 0
  const latest = entries.reduce(
    (acc, cur) =>
      (cur?.unix_seconds ?? 0) > (acc?.unix_seconds ?? 0)
        ? cur
        : acc,
    entries[0]
  )
  const tvl = Number(latest?.tvl ?? 0)
  return Number.isFinite(tvl) ? tvl : 0
}

const buildDailyUrl = (chain: string, fromEpoch: number) =>
  `https://api.sommelier.finance/dailyData/${chain}/allCellars/${fromEpoch}/latest`

const sommelierAPITVL = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // Use the same 31-day window as the strategies API to bound payload size
    const now = new Date()
    const monthAgoDate = new Date()
    monthAgoDate.setDate(now.getDate() - 31)
    monthAgoDate.setHours(0, 0, 0, 0)
    const monthAgoEpoch = Math.floor(monthAgoDate.getTime() / 1000)

    const [eth, arb, opt] = await Promise.all([
      fetchJson(buildDailyUrl("ethereum", monthAgoEpoch)),
      fetchJson(buildDailyUrl("arbitrum", monthAgoEpoch)),
      fetchJson(buildDailyUrl("optimism", monthAgoEpoch)),
    ])

    if (DEBUG_FETCH) {
      console.log("[tvl] fetch statuses", {
        eth: eth.status,
        arb: arb.status,
        opt: opt.status,
      })
    }

    // Build per-cellar TVL map using the most recent daily snapshot
    const tvlMap: Record<string, number> = {}
    const addChain = (
      chainData: typeof eth,
      suffix: string = ""
    ) => {
      if (!chainData.ok || !chainData.body?.Response) return
      Object.keys(chainData.body.Response).forEach((address) => {
        const key = (address + suffix).toLowerCase()
        if (!CellaAddressDataMap[key]) return
        tvlMap[key] = getLatestTvl(
          chainData.body as DailyDataResponse,
          address
        )
      })
    }

    addChain(eth)
    addChain(arb, "-arbitrum")
    addChain(opt, "-optimism")

    const total_tvl = Object.values(tvlMap).reduce(
      (acc, v) => acc + (Number.isFinite(v) ? v : 0),
      0
    )

    const formattedResult = {
      result: {
        data: {
          ...tvlMap,
          total_tvl,
        },
      },
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    // Format similar to subgraph queries so as to not rewrite large swaths of code
    res.status(200).json(formattedResult)
  } catch (error) {
    console.error(error)
    res.status(500).send({
      error: "failed to fetch data",
      message:
        (error as Error).message || "An unknown error occurred",
    })
  }
}

export default sommelierAPITVL
