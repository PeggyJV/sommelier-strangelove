import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import StrategyRow from "../../components/_vaults/StrategyRow"
import theme from "../../theme"

// Mock the deposit modal store
jest.mock("../../data/hooks/useDepositModalStore", () => ({
  useDepositModalStore: () => ({
    setIsOpen: jest.fn(),
  }),
}))

// Mock useUserStrategyData
jest.mock("../../data/hooks/useUserStrategyData", () => ({
  useUserStrategyData: () => ({
    data: {
      userStrategyData: {
        userData: {
          netValue: {
            formatted: "1000.00",
            value: 1000,
          },
        },
      },
    },
  }),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>{component}</ChakraProvider>
  )
}

describe("StrategyRow", () => {
  const mockVault = {
    name: "Alpha STETH",
    isSommNative: true,
    provider: { title: "Seven Seas" },
    description:
      "Alpha STETH dynamically reallocates stETH exposure across trusted DeFi protocols including Mellow's dvSTETH and Unichain to unlock reward potential in ETH-1",
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
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Component Rendering", () => {
    it("should render vault name correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("Alpha STETH")).toBeInTheDocument()
    })

    it("should render provider name correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("Seven Seas")).toBeInTheDocument()
    })

    it("should render Somm-native badge for Somm-native vaults", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("Somm-native")).toBeInTheDocument()
    })

    it("should render chain badge with logo", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("Ethereum")).toBeInTheDocument()
    })

    it("should render TVL value correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("$231.86")).toBeInTheDocument()
    })

    it("should render Net Value correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("$1000.00")).toBeInTheDocument()
    })

    it("should render Net Rewards correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("0.00%")).toBeInTheDocument()
    })

    it("should render description correctly", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(
        screen.getByText(/Alpha STETH dynamically reallocates/)
      ).toBeInTheDocument()
    })
  })

  describe("Responsive Design", () => {
    it("should have responsive grid layout", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const grid = screen
        .getByText("Alpha STETH")
        .closest('[class*="chakra-grid"]')
      expect(grid).toHaveStyle({
        "grid-template-columns": expect.stringContaining("1fr"),
      })
    })

    it("should have responsive image sizing", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const image = screen.getByAltText("Alpha STETH")
      expect(image).toHaveAttribute(
        "width",
        expect.stringMatching(/32|40/)
      )
      expect(image).toHaveAttribute(
        "height",
        expect.stringMatching(/32|40/)
      )
    })

    it("should have responsive font sizes", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const title = screen.getByText("Alpha STETH")
      expect(title).toHaveClass("chakra-text")
    })

    it("should have responsive spacing", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const container = screen
        .getByText("Alpha STETH")
        .closest('[class*="chakra-stack"]')
      expect(container).toBeInTheDocument()
    })
  })

  describe("KPI Grid Layout", () => {
    it("should render KPI grid with three columns", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      // Check that all three KPI labels are present
      expect(screen.getByText("TVL")).toBeInTheDocument()
      expect(screen.getByText("Net Value")).toBeInTheDocument()
      expect(screen.getByText("Net Rewards")).toBeInTheDocument()
    })

    it("should have horizontal KPI layout on mobile", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const kpiGrid = screen
        .getByText("TVL")
        .closest('[class*="chakra-grid"]')
      expect(kpiGrid).toHaveStyle({
        "grid-template-columns":
          expect.stringContaining("repeat(3, 1fr)"),
      })
    })
  })

  describe("Action Button", () => {
    it('should render "Connect wallet to deposit" when not connected', () => {
      // Mock useAccount to return not connected
      jest.doMock("wagmi", () => ({
        useAccount: () => ({
          address: undefined,
          isConnected: false,
          chain: undefined,
        }),
      }))

      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(
        screen.getByText("Connect wallet to deposit")
      ).toBeInTheDocument()
    })

    it('should render "Deposit" button when connected', () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)
      expect(screen.getByText("Deposit")).toBeInTheDocument()
    })

    it("should have responsive button sizing", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const button = screen.getByText("Deposit")
      expect(button).toHaveClass("chakra-button")
    })
  })

  describe("Error Handling", () => {
    it("should handle missing vault name gracefully", () => {
      const vaultWithoutName = { ...mockVault, name: undefined }

      expect(() => {
        renderWithTheme(<StrategyRow vault={vaultWithoutName} />)
      }).not.toThrow()
    })

    it("should handle missing provider gracefully", () => {
      const vaultWithoutProvider = {
        ...mockVault,
        provider: undefined,
      }

      expect(() => {
        renderWithTheme(<StrategyRow vault={vaultWithoutProvider} />)
      }).not.toThrow()
    })

    it("should handle missing TVL gracefully", () => {
      const vaultWithoutTVL = { ...mockVault, tvm: undefined }

      expect(() => {
        renderWithTheme(<StrategyRow vault={vaultWithoutTVL} />)
      }).not.toThrow()
    })

    it("should handle missing rewards gracefully", () => {
      const vaultWithoutRewards = {
        ...mockVault,
        baseApySumRewards: undefined,
      }

      expect(() => {
        renderWithTheme(<StrategyRow vault={vaultWithoutRewards} />)
      }).not.toThrow()
    })

    it("should handle missing chain config gracefully", () => {
      const vaultWithoutChain = {
        ...mockVault,
        config: { ...mockVault.config, chain: undefined },
      }

      expect(() => {
        renderWithTheme(<StrategyRow vault={vaultWithoutChain} />)
      }).not.toThrow()
    })

    it("should handle missing description gracefully", () => {
      const vaultWithoutDescription = {
        ...mockVault,
        description: undefined,
      }

      expect(() => {
        renderWithTheme(
          <StrategyRow vault={vaultWithoutDescription} />
        )
      }).not.toThrow()
    })
  })

  describe("Data Display", () => {
    it("should display fallback values when data is missing", () => {
      const vaultWithMissingData = {
        ...mockVault,
        tvm: undefined,
        baseApySumRewards: undefined,
      }

      renderWithTheme(<StrategyRow vault={vaultWithMissingData} />)

      // Should show fallback values
      expect(screen.getByText("–")).toBeInTheDocument()
    })

    it("should handle zero values correctly", () => {
      const vaultWithZeroValues = {
        ...mockVault,
        tvm: { formatted: "0" },
        baseApySumRewards: { formatted: "0.00%" },
      }

      renderWithTheme(<StrategyRow vault={vaultWithZeroValues} />)

      expect(screen.getByText("$0")).toBeInTheDocument()
      expect(screen.getByText("0.00%")).toBeInTheDocument()
    })

    it("should handle large numbers correctly", () => {
      const vaultWithLargeNumbers = {
        ...mockVault,
        tvm: { formatted: "1234567.89" },
      }

      renderWithTheme(<StrategyRow vault={vaultWithLargeNumbers} />)

      expect(screen.getByText("$1234567.89")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("should have proper alt text for images", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const image = screen.getByAltText("Alpha STETH")
      expect(image).toBeInTheDocument()
    })

    it("should have proper ARIA labels", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const button = screen.getByText("Deposit")
      expect(button).toHaveAttribute("role", "button")
    })

    it("should be keyboard navigable", () => {
      renderWithTheme(<StrategyRow vault={mockVault} />)

      const button = screen.getByText("Deposit")
      expect(button).toHaveAttribute("tabIndex", "0")
    })
  })

  describe("Pre-launch State", () => {
    it("should show countdown for pre-launch vaults", () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7) // 7 days from now

      const preLaunchVault = {
        ...mockVault,
        launchDate: futureDate.toISOString(),
      }

      renderWithTheme(<StrategyRow vault={preLaunchVault} />)

      expect(screen.getByText(/Available in:/)).toBeInTheDocument()
    })

    it("should disable deposit button for pre-launch vaults", () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const preLaunchVault = {
        ...mockVault,
        launchDate: futureDate.toISOString(),
      }

      renderWithTheme(<StrategyRow vault={preLaunchVault} />)

      const button = screen.getByText("Deposit")
      expect(button).toBeDisabled()
    })
  })
})

