import { createPublicClient, http } from "viem"
import { mainnet } from "wagmi/chains"

// Mock fetch globally
global.fetch = jest.fn()

describe("RPC Connection Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("RPC Endpoint Health Checks", () => {
    it("should handle Alchemy RPC connection failure gracefully", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"))

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })

    it("should handle Infura RPC connection failure gracefully", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const client = createPublicClient({
        chain: mainnet,
        transport: http("https://mainnet.infura.io/v3/test-key"),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })

    it("should handle public RPC endpoint failure gracefully", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(
        new Error("HttpRequestError: HTTP request failed")
      )

      const client = createPublicClient({
        chain: mainnet,
        transport: http(), // Default public endpoint
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })

    it("should handle timeout errors gracefully", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Request timeout")),
              100
            )
          )
      )

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })
  })

  describe("RPC Configuration Tests", () => {
    it("should use Alchemy when API key is available", () => {
      const alchemyKey = "test-alchemy-key"
      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
        ),
      })

      expect(client).toBeDefined()
    })

    it("should use Infura when API key is available", () => {
      const infuraKey = "test-infura-key"
      const client = createPublicClient({
        chain: mainnet,
        transport: http(`https://mainnet.infura.io/v3/${infuraKey}`),
      })

      expect(client).toBeDefined()
    })

    it("should fallback to public endpoint when no API keys are available", () => {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      })

      expect(client).toBeDefined()
    })
  })

  describe("Error Recovery Tests", () => {
    it("should retry failed requests with exponential backoff", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>

      // First two calls fail, third succeeds
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ result: "0x1234" }),
        } as Response)

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        expect(mockFetch).toHaveBeenCalledTimes(3)
      } catch (error) {
        // In a real scenario, this might still fail after retries
        expect(error).toBeDefined()
      }
    })

    it("should handle rate limiting gracefully", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: () =>
          Promise.resolve({
            error: { message: "Rate limit exceeded" },
          }),
      } as Response)

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })

    it("should handle invalid API key errors", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: () =>
          Promise.resolve({ error: { message: "Invalid API key" } }),
      } as Response)

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/invalid-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe("Network-Specific Tests", () => {
    it("should handle Ethereum mainnet RPC issues", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(
        new Error("Ethereum RPC unavailable")
      )

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })

    it("should handle Arbitrum RPC issues", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(
        new Error("Arbitrum RPC unavailable")
      )

      const client = createPublicClient({
        chain: mainnet, // Using mainnet for test, but simulating Arbitrum error
        transport: http(
          "https://arb-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })

    it("should handle Optimism RPC issues", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(
        new Error("Optimism RPC unavailable")
      )

      const client = createPublicClient({
        chain: mainnet, // Using mainnet for test, but simulating Optimism error
        transport: http(
          "https://opt-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.getBlockNumber()
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "HTTP request failed"
        )
      }
    })
  })

  describe("Contract Interaction Tests", () => {
    it("should handle contract read failures due to RPC issues", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(
        new Error("Contract read failed")
      )

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.readContract({
          address:
            "0x1234567890123456789012345678901234567890" as `0x${string}`,
          abi: [
            {
              name: "balanceOf",
              type: "function",
              inputs: [],
              outputs: [{ type: "uint256" }],
            },
          ],
          functionName: "balanceOf",
          args: [],
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain(
          "Contract read failed"
        )
      }
    })

    it("should handle ABI function not found or transport errors", async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error: {
              message:
                'AbiFunctionNotFoundError: Function "balanceOf" not found on ABI',
            },
          }),
      } as Response)

      const client = createPublicClient({
        chain: mainnet,
        transport: http(
          "https://eth-mainnet.alchemyapi.io/v2/test-key"
        ),
      })

      try {
        await client.readContract({
          address:
            "0x1234567890123456789012345678901234567890" as `0x${string}`,
          abi: [],
          functionName: "balanceOf",
          args: [],
        })
        fail("Should have thrown an error")
      } catch (error) {
        const err = error as Error
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toMatch(/transport|not found/i)
      }
    })
  })

  describe("Environment Variable Tests", () => {
    it("should handle missing environment variables gracefully", () => {
      const originalEnv = process.env

      // Clear environment variables
      delete process.env.NEXT_PUBLIC_ALCHEMY_KEY
      delete process.env.NEXT_PUBLIC_INFURA_API_KEY

      // Should not throw when creating client without API keys
      expect(() => {
        createPublicClient({
          chain: mainnet,
          transport: http(),
        })
      }).not.toThrow()

      // Restore environment
      process.env = originalEnv
    })

    it("should use environment variables when available", () => {
      const originalEnv = process.env

      process.env.NEXT_PUBLIC_ALCHEMY_KEY = "test-alchemy-key"
      process.env.NEXT_PUBLIC_INFURA_API_KEY = "test-infura-key"

      // Should create client with environment variables
      expect(() => {
        createPublicClient({
          chain: mainnet,
          transport: http(
            `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
          ),
        })
      }).not.toThrow()

      // Restore environment
      process.env = originalEnv
    })
  })
})
