import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useUserStrategyData } from "../../data/hooks/useUserStrategyData"
import { cellarDataMap } from "../../data/cellarDataMap"

const mockUseAccount = jest.fn()
const mockUseWalletClient = jest.fn()
const mockUseUserBalance = jest.fn()
const mockUseStrategyData = jest.fn()
const mockUseCoinGeckoPrice = jest.fn()
const mockUseCreateContracts = jest.fn()

// Mock the hooks
jest.mock("wagmi", () => ({
  useAccount: () => mockUseAccount(),
  useWalletClient: () => mockUseWalletClient(),
}))

jest.mock("../../data/hooks/useUserBalance", () => ({
  useUserBalance: (...args: unknown[]) => mockUseUserBalance(...args),
}))

jest.mock("../../data/hooks/useStrategyData", () => ({
  useStrategyData: (...args: unknown[]) => mockUseStrategyData(...args),
}))

jest.mock("../../data/hooks/useCoinGeckoPrice", () => ({
  useCoinGeckoPrice: (...args: unknown[]) =>
    mockUseCoinGeckoPrice(...args),
}))

jest.mock("../../data/hooks/useCreateContracts", () => ({
  useCreateContracts: (...args: unknown[]) =>
    mockUseCreateContracts(...args),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe("useUserStrategyData", () => {
  const firstConfig = Object.values(cellarDataMap)[0]?.config
  const mockStrategyAddress = firstConfig?.cellar.address ?? ""
  const mockChainId = firstConfig?.chain.id ?? ""

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseAccount.mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    })
    mockUseWalletClient.mockReturnValue({ data: undefined })
    mockUseUserBalance.mockReturnValue({
      lpToken: {
        data: {
          value: BigInt("1000000000000000000"),
          formatted: "1.0",
          decimals: 18,
        },
        isLoading: false,
      },
    })
    mockUseStrategyData.mockReturnValue({
      data: {
        tokenPrice: "1.5",
        cellar: {
          address: mockStrategyAddress,
        },
      },
      isLoading: false,
    })
    mockUseCoinGeckoPrice.mockReturnValue({
      data: "2000.00",
      isLoading: false,
    })
    mockUseCreateContracts.mockReturnValue({
      stakerContract: undefined,
    })
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
      expect(userData?.netValue.formatted).toBe("$1.50") // 1.0 * 1.5
      expect(userData?.netValue.value).toBe(1.5)
    })

    it("should handle zero LP token balance", async () => {
      mockUseUserBalance.mockReturnValue({
        lpToken: {
          data: {
            value: BigInt("0"),
            formatted: "0.0",
            decimals: 18,
          },
          isLoading: false,
        },
      })

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
      mockUseStrategyData.mockReturnValue({
        data: {
          tokenPrice: null,
          cellar: {
            address: mockStrategyAddress,
          },
        },
        isLoading: false,
      })

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
      mockUseCoinGeckoPrice.mockReturnValue({
        data: null,
        isLoading: false,
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$1.50")
      expect(userData?.netValue.value).toBe(1.5)
    })

    it("should handle large numbers correctly", async () => {
      mockUseUserBalance.mockReturnValue({
        lpToken: {
          data: {
            value: BigInt("1000000000000000000000"), // 1000 tokens in wei
            formatted: "1000.0",
            decimals: 18,
          },
          isLoading: false,
        },
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("$1.50K") // 1000 * 1.5
      expect(userData?.netValue.value).toBe(1500)
    })
  })

  describe("Error Handling", () => {
    it("should handle missing LP token data gracefully", async () => {
      mockUseUserBalance.mockReturnValue({
        lpToken: {
          data: null,
          isLoading: false,
        },
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.netValue.formatted).toBe("0")
      expect(userData?.shares.formatted).toBe("0")
    })

    it("should handle missing strategy data gracefully", async () => {
      mockUseStrategyData.mockReturnValue({
        data: null,
        isLoading: false,
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.data).toBeUndefined()
    })

    it("should handle missing user address gracefully", async () => {
      mockUseAccount.mockReturnValue({
        address: null,
        isConnected: false,
      })

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
      mockUseUserBalance.mockReturnValue({
        lpToken: {
          data: null,
          isLoading: true,
        },
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(true)
    })

    it("should show loading state when strategy data is loading", async () => {
      mockUseStrategyData.mockReturnValue({
        data: null,
        isLoading: true,
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      expect(result.current.isLoading).toBe(false)
    })

    it("should show loading state when coin price is loading", async () => {
      mockUseCoinGeckoPrice.mockReturnValue({
        data: null,
        isLoading: true,
      })

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
      mockUseUserBalance.mockReturnValue({
        lpToken: {
          data: {
            value: BigInt("1234567890123456789"), // 1.234567890123456789 tokens
            formatted: "1.234567890123456789",
            decimals: 18,
          },
          isLoading: false,
        },
      })

      const { result } = renderHook(
        () => useUserStrategyData(mockStrategyAddress, mockChainId),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const userData = result.current.data?.userStrategyData.userData
      expect(userData?.shares.formatted).toBe("1.234567890123456789")
      expect(userData?.netValue.formatted).toBe("$1.85") // 1.234567890123456789 * 1.5
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

      expect(result.current.data).toBeUndefined()
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

      expect(result.current.data).toBeUndefined()
    })
  })
})
