import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals"
import { wrapConnector } from "../wallet"

function makeFakeProvider(returnValue: any) {
  const calls: any[] = []
  const provider: any = {
    request: jest.fn(async (req: any) => {
      calls.push(req)
      return typeof returnValue === "function"
        ? returnValue(req)
        : returnValue
    }),
  }
  return { provider, calls }
}

function makeFakeConnector(provider: any) {
  return {
    __testName: "fake-connector",
    getProvider: jest.fn(async () => provider),
  } as any
}

function parsePostedBody(): any {
  const [, init] = (global.fetch as jest.Mock).mock.calls[0]
  const body = JSON.parse((init as any).body)
  // Support both { events:[...] } and flat body contracts
  if (body && Array.isArray(body.events)) return body.events[0]
  return body
}

describe("wrapConnector → submitted POST (Jest)", () => {
  const originalEnv = { ...process.env }
  const originalFetch = (global as any).fetch as any

  beforeEach(() => {
    process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED = "true"
    ;(global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    })
    jest.clearAllMocks()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    ;(global as any).fetch = originalFetch
  })

  it("posts submitted with txHash when method is eth_sendTransaction (string hash)", async () => {
    const txHash =
      "0x1111111111111111111111111111111111111111111111111111111111110abc"
    const { provider } = makeFakeProvider(txHash)
    const base = makeFakeConnector(provider)
    const wrapped = wrapConnector(base)

    const p = await (wrapped as any).getProvider()
    const res = await p.request({
      method: "eth_sendTransaction",
      params: [{ from: "0xF", to: "0xT" }],
    })
    expect(res).toBe(txHash)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toBe("/api/ingest-rpc")
    expect((init as any).method).toBe("POST")
    expect(((init as any).headers as any)["content-type"]).toBe(
      "application/json"
    )

    const evt = parsePostedBody()
    expect(evt.stage).toBe("submitted")
    expect(evt.method).toBe("eth_sendTransaction")
    expect(evt.txHash).toBe(txHash)
    expect(typeof evt.timestampMs).toBe("number")
  })

  it("posts submitted with txHash when method is eth_sendRawTransaction (object with hash)", async () => {
    const hashObj = {
      hash: "0x2222222222222222222222222222222222222222222222222222222222220def",
    }
    const { provider } = makeFakeProvider(hashObj)
    const base = makeFakeConnector(provider)
    const wrapped = wrapConnector(base)

    const p = await (wrapped as any).getProvider()
    const res = await p.request({
      method: "eth_sendRawTransaction",
      params: ["0xDEADBEEF"],
    })
    expect(res).toEqual(hashObj)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const evt = parsePostedBody()
    expect(evt.method).toBe("eth_sendRawTransaction")
    expect(evt.txHash).toBe(hashObj.hash)
  })

  it("does not POST for read-only methods (eth_call)", async () => {
    const { provider } = makeFakeProvider("0xRETURN")
    const base = makeFakeConnector(provider)
    const wrapped = wrapConnector(base)

    const p = await (wrapped as any).getProvider()
    await p.request({ method: "eth_call", params: [] })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("is idempotent: wrapping same connector twice does not double-patch", async () => {
    const txHash =
      "0x3333333333333333333333333333333333333333333333333333333333330abc"
    const { provider } = makeFakeProvider(txHash)
    const base = makeFakeConnector(provider)

    const once = wrapConnector(base)
    const twice = wrapConnector(once) // no-op second time

    const p = await (twice as any).getProvider()
    await p.request({ method: "eth_sendTransaction", params: [] })

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it("swallows fetch errors and still returns provider result", async () => {
    const txHash =
      "0x4444444444444444444444444444444444444444444444444444444444440abc"
    ;(global as any).fetch = jest
      .fn()
      .mockRejectedValue(new Error("network down"))

    const { provider } = makeFakeProvider(txHash)
    const base = makeFakeConnector(provider)
    const wrapped = wrapConnector(base)

    const p = await (wrapped as any).getProvider()
    const res = await p.request({
      method: "eth_sendTransaction",
      params: [],
    })

    expect(res).toBe(txHash)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
