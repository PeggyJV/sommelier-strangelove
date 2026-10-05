import { NextApiRequest, NextApiResponse } from "next"

const mockQueryContract = jest.fn()
// Spread the real module: chainConfig reads INFURA_API_URL/ALCHEMY_API_URL
// from it at import time, so replacing the whole module breaks cellarDataMap.
jest.mock("context/rpc_context", () => ({
  ...jest.requireActual("context/rpc_context"),
  queryContract: (...args: unknown[]) => mockQueryContract(...args),
}))

import withdrawalStatus from "../../pages/api/withdrawal-status"

const makeRes = () => {
  const json = jest.fn()
  const res = {
    status: jest.fn().mockReturnThis(),
    json,
    send: jest.fn(),
    setHeader: jest.fn(),
  } as unknown as NextApiResponse
  return { res, json }
}

const call = async (cellarId?: string) => {
  const { res, json } = makeRes()
  await withdrawalStatus(
    { query: { cellarId } } as unknown as NextApiRequest,
    res
  )
  return { res, json }
}

describe("/api/withdrawal-status", () => {
  it("rejects an unknown cellar id", async () => {
    const { res } = await call("not-a-vault")
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it("reports not-paused for a vault outside the watch list", async () => {
    const { json } = await call("Real-Yield-USD")
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ paused: false, reason: "not_watched" })
    )
    expect(mockQueryContract).not.toHaveBeenCalled()
  })

  it("clears itself once previewRedeem stops reverting", async () => {
    mockQueryContract.mockResolvedValue({
      read: { previewRedeem: jest.fn().mockResolvedValue(1170871976842569140n) },
    })
    const { json } = await call("Real-Yield-ETH")
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ paused: false, reason: "redeemable" })
    )
  })

  it("probes Real Yield USD on Arbitrum before enabling withdrawals", async () => {
    const previewRedeem = jest.fn().mockResolvedValue(1000000n)
    mockQueryContract.mockResolvedValue({ read: { previewRedeem } })

    const { json } = await call("real-yield-usd-arb")

    expect(previewRedeem).toHaveBeenCalledWith([1000000n])
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ paused: false, reason: "redeemable" })
    )
  })

  it("reports paused while previewRedeem reverts", async () => {
    mockQueryContract.mockResolvedValue({
      read: {
        previewRedeem: jest
          .fn()
          .mockRejectedValue(new Error('reverted with signature "0x229e78bb"')),
      },
    })
    const { json } = await call("Real-Yield-ETH")
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ paused: true, reason: "reverts" })
    )
  })

  it("fails safe to paused when the probe cannot run", async () => {
    mockQueryContract.mockResolvedValue(null)
    const { json } = await call("Turbo-STETH")
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ paused: true, reason: "probe_unavailable" })
    )
  })
})
