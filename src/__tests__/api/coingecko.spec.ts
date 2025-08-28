import { NextApiRequest, NextApiResponse } from "next"
import coinGeckoSimplePrice from "../../pages/api/coingecko-simple-price"

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000"

describe("CoinGecko API Tests", () => {
  let mockReq: Partial<NextApiRequest>
  let mockRes: Partial<NextApiResponse>
  let jsonMock: jest.Mock
  let statusMock: jest.Mock
  let sendMock: jest.Mock

  beforeEach(() => {
    jsonMock = jest.fn()
    statusMock = jest.fn().mockReturnThis()
    sendMock = jest.fn()

    mockRes = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
      setHeader: jest.fn(),
    }

    mockReq = {
      query: {},
    }

    jest.clearAllMocks()
  })

  describe("API Error Handling", () => {
    it("should handle unknown coin ID gracefully", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      mockReq.query = { base: "unknown-coin-id", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(jsonMock).toHaveBeenCalledWith({
        price: null,
        baseId: "unknown-coin-id",
        quoteId: "usd",
        source: "coingecko",
        note: "not_found_or_rate_limited",
      })
    })

    it("should handle network errors gracefully", async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(jsonMock).toHaveBeenCalledWith({
        price: null,
        baseId: "bitcoin",
        quoteId: "usd",
        source: "coingecko",
        note: "request_failed",
      })
    })

    it("should handle malformed response gracefully", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: "response" }),
      })

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(jsonMock).toHaveBeenCalledWith({
        price: null,
        baseId: "bitcoin",
        quoteId: "usd",
        source: "coingecko",
        note: "not_found_or_rate_limited",
      })
    })
  })

  describe("Input Validation", () => {
    it("should handle missing base parameter", async () => {
      mockReq.query = { quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(sendMock).toHaveBeenCalledWith({
        error: "missing base or quote",
        message: "missing base or quote",
      })
    })

    it("should handle missing quote parameter", async () => {
      mockReq.query = { base: "bitcoin" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(sendMock).toHaveBeenCalledWith({
        error: "missing base or quote",
        message: "missing base or quote",
      })
    })

    it("should handle empty parameters", async () => {
      mockReq.query = { base: "", quote: "" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(sendMock).toHaveBeenCalledWith({
        error: "missing base or quote",
        message: "missing base or quote",
      })
    })
  })

  describe("Successful API Calls", () => {
    it("should return price for valid coin", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { usd: 50000 } }),
      })

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(jsonMock).toHaveBeenCalledWith({ price: 50000 })
    })

    it("should handle multiple currencies", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ethereum: { usd: 3000, eur: 2500 } }),
      })

      mockReq.query = { base: "ethereum", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(jsonMock).toHaveBeenCalledWith({ price: 3000 })
    })
  })

  describe("Caching Headers", () => {
    it("should set proper cache headers", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { usd: 50000 } }),
      })

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
      )
    })
  })

  describe("API Key Handling", () => {
    it("should use pro API when key is available", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
      process.env.NEXT_PUBLIC_COINGECKO_API_KEY = "test-key"

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { usd: 50000 } }),
      })

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

             expect(global.fetch).toHaveBeenCalledWith(
         "https://api.coingecko.com/api/v3/simple/price/?ids=bitcoin&vs_currencies=usd",
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-cg-pro-api-key": "test-key",
          }),
        })
      )

      process.env.NEXT_PUBLIC_COINGECKO_API_KEY = originalEnv
    })

    it("should use free API when no key is available", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
      delete process.env.NEXT_PUBLIC_COINGECKO_API_KEY

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { usd: 50000 } }),
      })

      mockReq.query = { base: "bitcoin", quote: "usd" }

      await coinGeckoSimplePrice(mockReq as NextApiRequest, mockRes as NextApiResponse)

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.coingecko.com/api/v3/simple/price/?ids=bitcoin&vs_currencies=usd",
        expect.objectContaining({
          headers: expect.not.objectContaining({
            "x-cg-pro-api-key": expect.anything(),
          }),
        })
      )

      process.env.NEXT_PUBLIC_COINGECKO_API_KEY = originalEnv
    })
  })
})


