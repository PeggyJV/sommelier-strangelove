import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { PageHome } from "../../components/_pages/PageHome"
import theme from "../../theme"

// Mock all the hooks and providers
jest.mock("wagmi", () => ({
  useAccount: () => ({
    address: "0x1234567890123456789012345678901234567890",
    isConnected: true,
    chain: { id: 1, name: "Ethereum" },
  }),
  usePublicClient: () => ({
    chain: { id: 1, name: "Ethereum" },
    getBalance: jest.fn(),
    readContract: jest.fn(),
  }),
  useWalletClient: () => ({
    data: {
      chain: { id: 1, name: "Ethereum" },
      writeContract: jest.fn(),
    },
  }),
  useSwitchChain: () => ({
    switchChainAsync: jest.fn(),
  }),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock("../../data/hooks/useAllStrategiesData", () => ({
  useAllStrategiesData: () => ({
    data: [
      {
        name: "Alpha STETH",
        isSommNative: true,
        provider: { title: "Seven Seas" },
        description: "Test description",
        tvm: { formatted: "231.86" },
        baseApySumRewards: { formatted: "0.00%" },
        config: {
          chain: {
            displayName: "Ethereum",
            id: "ethereum",
            wagmiId: 1,
            logoPath: "/assets/icons/ethereum-alt.png",
          },
          cellar: {
            address: "0x1234567890123456789012345678901234567890",
          },
        },
        slug: "Alpha-stETH",
      },
    ],
    isLoading: false,
    isError: false,
  }),
}))

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={{} as any}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

describe("Application Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Home Page Integration", () => {
    it("should render home page with vaults", async () => {
      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("Alpha STETH")).toBeInTheDocument()
      })

      expect(screen.getByText("Seven Seas")).toBeInTheDocument()
      expect(screen.getByText("Somm-native")).toBeInTheDocument()
      expect(screen.getByText("Ethereum")).toBeInTheDocument()
    })

    it("should display vault statistics correctly", async () => {
      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("$231.86")).toBeInTheDocument()
        expect(screen.getByText("0.00%")).toBeInTheDocument()
      })
    })

    it("should handle loading state gracefully", async () => {
      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => ({
          data: null,
          isLoading: true,
          isError: false,
        }),
      }))

      render(<PageHome />, { wrapper: createTestWrapper() })

      // Should show loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it("should handle error state gracefully", async () => {
      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => ({
          data: null,
          isLoading: false,
          isError: true,
        }),
      }))

      render(<PageHome />, { wrapper: createTestWrapper() })

      // Should show error state
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  describe("Responsive Design Integration", () => {
    it("should render correctly on mobile viewport", async () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("Alpha STETH")).toBeInTheDocument()
      })

      // Check that the layout is responsive
      const vaultCard = screen
        .getByText("Alpha STETH")
        .closest('[class*="chakra-grid"]')
      expect(vaultCard).toBeInTheDocument()
    })

    it("should render correctly on desktop viewport", async () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      })

      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("Alpha STETH")).toBeInTheDocument()
      })

      // Check that the layout is responsive
      const vaultCard = screen
        .getByText("Alpha STETH")
        .closest('[class*="chakra-grid"]')
      expect(vaultCard).toBeInTheDocument()
    })
  })

  describe("Wallet Integration", () => {
    it("should show connect wallet button when not connected", async () => {
      jest.doMock("wagmi", () => ({
        useAccount: () => ({
          address: null,
          isConnected: false,
          chain: null,
        }),
        usePublicClient: () => ({
          chain: { id: 1, name: "Ethereum" },
          getBalance: jest.fn(),
          readContract: jest.fn(),
        }),
        useWalletClient: () => ({
          data: null,
        }),
        useSwitchChain: () => ({
          switchChainAsync: jest.fn(),
        }),
        WagmiProvider: ({
          children,
        }: {
          children: React.ReactNode
        }) => <div>{children}</div>,
      }))

      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(
          screen.getByText(/connect wallet/i)
        ).toBeInTheDocument()
      })
    })

    it("should show deposit button when connected", async () => {
      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("Deposit")).toBeInTheDocument()
      })
    })
  })

  describe("Data Flow Integration", () => {
    it("should handle missing vault data gracefully", async () => {
      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => ({
          data: [
            {
              name: "Alpha STETH",
              isSommNative: true,
              provider: { title: "Seven Seas" },
              description: "Test description",
              tvm: null, // Missing TVL
              baseApySumRewards: null, // Missing rewards
              config: {
                chain: {
                  displayName: "Ethereum",
                  id: "ethereum",
                  wagmiId: 1,
                  logoPath: "/assets/icons/ethereum-alt.png",
                },
                cellar: {
                  address:
                    "0x1234567890123456789012345678901234567890",
                },
              },
              slug: "Alpha-stETH",
            },
          ],
          isLoading: false,
          isError: false,
        }),
      }))

      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(screen.getByText("Alpha STETH")).toBeInTheDocument()
      })

      // Should show fallback values
      expect(screen.getByText("–")).toBeInTheDocument()
    })

    it("should handle empty vault list", async () => {
      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => ({
          data: [],
          isLoading: false,
          isError: false,
        }),
      }))

      render(<PageHome />, { wrapper: createTestWrapper() })

      await waitFor(() => {
        expect(
          screen.getByText(/no vaults available/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe("Error Boundary Integration", () => {
    it("should handle component errors gracefully", async () => {
      // Mock a component that throws an error
      const ErrorComponent = () => {
        throw new Error("Test error")
      }

      // This would normally be caught by an error boundary
      expect(() => {
        render(<ErrorComponent />, { wrapper: createTestWrapper() })
      }).toThrow("Test error")
    })

    it("should handle async errors gracefully", async () => {
      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => {
          throw new Error("Async error")
        },
      }))

      expect(() => {
        render(<PageHome />, { wrapper: createTestWrapper() })
      }).toThrow("Async error")
    })
  })

  describe("Performance Integration", () => {
    it("should render large vault lists efficiently", async () => {
      const largeVaultList = Array(100)
        .fill(null)
        .map((_, index) => ({
          name: `Vault ${index}`,
          isSommNative: true,
          provider: { title: "Provider" },
          description: "Test description",
          tvm: { formatted: "100.00" },
          baseApySumRewards: { formatted: "5.00%" },
          config: {
            chain: {
              displayName: "Ethereum",
              id: "ethereum",
              wagmiId: 1,
              logoPath: "/assets/icons/ethereum-alt.png",
            },
            cellar: {
              address: "0x1234567890123456789012345678901234567890",
            },
          },
          slug: `vault-${index}`,
        }))

      jest.doMock("../../data/hooks/useAllStrategiesData", () => ({
        useAllStrategiesData: () => ({
          data: largeVaultList,
          isLoading: false,
          isError: false,
        }),
      }))

      const startTime = Date.now()
      render(<PageHome />, { wrapper: createTestWrapper() })
      const endTime = Date.now()

      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(5000)

      await waitFor(() => {
        expect(screen.getByText("Vault 0")).toBeInTheDocument()
        expect(screen.getByText("Vault 99")).toBeInTheDocument()
      })
    })
  })
})

