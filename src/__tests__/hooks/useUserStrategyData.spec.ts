import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useUserStrategyData } from "../../data/hooks/useUserStrategyData"

// Mock the hooks
jest.mock("wagmi", () => ({
  useAccount: () => ({
    address: "0x1234567890123456789012345678901234567890",
    isConnected: true,
  }),
}))

jest.mock("../../data/hooks/useUserBalance", () => ({
  useUserBalance: () => ({
    lpToken: {
      data: {
        value: BigInt("1000000000000000000"), // 1 token in wei
        formatted: "1.0",
        decimals: 18,
      },
      isLoading: false,
    },
  }),
}))

jest.mock("../../data/hooks/useStrategyData", () => ({
  useStrategyData: () => ({
    data: {
      tokenPrice: "1.5",
      cellar: {
        address: "0x1234567890123456789012345678901234567890",
      },
    },
    isLoading: false,
  }),
}))

jest.mock("../../data/hooks/useCoinGeckoPrice", () => ({
  useCoinGeckoPrice: () => ({
    data: "2000.00", // ETH price
    isLoading: false,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe("useUserStrategyData", () => {
  const mockStrategyAddress =
    "0x1234567890123456789012345678901234567890"
  const mockChainId = "ethereum"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Net Value Calculation", () => {
    it("should calculate net value correctly with valid data", async () => {
      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$3,000.00") // 1.0 * 1.5 * 2000
      expect(userData?.netValue.value).toBe(3000)
    })

    it("should handle zero LP token balance", async () => {
      jest.doMock("../../data/hooks/useUserBalance", () => ({
        useUserBalance: () => ({
          lpToken: {
            data: {
              value: BigInt("0"),
              formatted: "0.0",
              decimals: 18,
            },
            isLoading: false,
          },
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$0.00")
      expect(userData?.netValue.value).toBe(0)
    })

    it("should handle missing token price", async () => {
      jest.doMock("../../data/hooks/useStrategyData", () => ({
        useStrategyData: () => ({
          data: {
            tokenPrice: null,
            cellar: {
              address: "0x1234567890123456789012345678901234567890",
            },
          },
          isLoading: false,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$0.00")
      expect(userData?.netValue.value).toBe(0)
    })

    it("should handle missing base asset price", async () => {
      jest.doMock("../../data/hooks/useCoinGeckoPrice", () => ({
        useCoinGeckoPrice: () => ({
          data: null,
          isLoading: false,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$0.00")
      expect(userData?.netValue.value).toBe(0)
    })

    it("should handle large numbers correctly", async () => {
      jest.doMock("../../data/hooks/useUserBalance", () => ({
        useUserBalance: () => ({
          lpToken: {
            data: {
              value: BigInt("1000000000000000000000"), // 1000 tokens in wei
              formatted: "1000.0",
              decimals: 18,
            },
            isLoading: false,
          },
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$3,000,000.00") // 1000 * 1.5 * 2000
      expect(userData?.netValue.value).toBe(3000000)
    })
  })

  describe("Error Handling", () => {
    it("should handle missing LP token data gracefully", async () => {
      jest.doMock("../../data/hooks/useUserBalance", () => ({
        useUserBalance: () => ({
          lpToken: {
            data: null,
            isLoading: false,
          },
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$0.00")
      expect(userData?.shares.formatted).toBe("0")
    })

    it("should handle missing strategy data gracefully", async () => {
      jest.doMock("../../data/hooks/useStrategyData", () => ({
        useStrategyData: () => ({
          data: null,
          isLoading: false,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$0.00")
    })

    it("should handle missing user address gracefully", async () => {
      jest.doMock("wagmi", () => ({
        useAccount: () => ({
          address: null,
          isConnected: false,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })

    it("should handle invalid strategy address gracefully", async () => {
      const { result } = renderHook(
        () => useUserStrategyData("", mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.data).toBeUndefined()
    })

    it("should handle invalid chain ID gracefully", async () => {
      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, ""),
        { wrapper: createWrapper() }
      )

      expect(result.current.data).toBeUndefined()
    })
  })

  describe("Loading States", () => {
    it("should show loading state when LP token is loading", async () => {
      jest.doMock("../../data/hooks/useUserBalance", () => ({
        useUserBalance: () => ({
          lpToken: {
            data: null,
            isLoading: true,
          },
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(true)
    })

    it("should show loading state when strategy data is loading", async () => {
      jest.doMock("../../data/hooks/useStrategyData", () => ({
        useStrategyData: () => ({
          data: null,
          isLoading: true,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(true)
    })

    it("should show loading state when coin price is loading", async () => {
      jest.doMock("../../data/hooks/useCoinGeckoPrice", () => ({
        useCoinGeckoPrice: () => ({
          data: null,
          isLoading: true,
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe("Data Formatting", () => {
    it("should format shares correctly", async () => {
      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.shares.formatted).toBe("1.0")
      expect(userData?.shares.value).toBe(
        BigInt("1000000000000000000")
      )
    })

    it("should format staked shares correctly", async () => {
      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.stakedShares.formatted).toBe("0")
      expect(userData?.stakedShares.value).toBe(BigInt("0"))
    })

    it("should handle decimal precision correctly", async () => {
      jest.doMock("../../data/hooks/useUserBalance", () => ({
        useUserBalance: () => ({
          lpToken: {
            data: {
              value: BigInt("1234567890123456789"), // 1.234567890123456789 tokens
              formatted: "1.234567890123456789",
              decimals: 18,
            },
            isLoading: false,
          },
        }),
      }))

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.shares.formatted).toBe("1.234567890123456789")
      expect(userData?.netValue.formatted).toBe("$3,703.70") // 1.234567890123456789 * 1.5 * 2000
    })
  })

  describe("Query Dependencies", () => {
    it("should refetch when strategy address changes", async () => {
      const { result, rerender } = renderHook(
        ({ address, chain }) => useUserStrategyData(address, chain),
        {
          wrapper: createWrapper(),
          initialProps: {
            address: mockStrategyAddress,
            chain: mockChainId,
          },
        }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const newAddress = "0x9876543210987654321098765432109876543210"
      rerender({ address: newAddress, chain: mockChainId })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })
    })

    it("should refetch when chain ID changes", async () => {
      const { result, rerender } = renderHook(
        ({ address, chain }) => useUserStrategyData(address, chain),
        {
          wrapper: createWrapper(),
          initialProps: {
            address: mockStrategyAddress,
            chain: mockChainId,
          },
        }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const newChain = "arbitrum"
      rerender({ address: mockStrategyAddress, chain: newChain })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })
    })
  })
})

