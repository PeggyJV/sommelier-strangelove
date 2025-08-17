import React from "react"
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import { VaultActionButton } from "../../components/_buttons/VaultActionButton"
import theme from "../../theme"

// Mock the deposit modal store
jest.mock("../../data/hooks/useDepositModalStore", () => ({
  useDepositModalStore: () => ({
    setIsOpen: jest.fn(),
  }),
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>{component}</ChakraProvider>
  )
}

describe("VaultActionButton", () => {
  const mockVault = {
    status: "active" as const,
    config: {
      chain: {
        wagmiId: 1,
        displayName: "Ethereum",
      },
    },
    onAction: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Button Rendering", () => {
    it('should render "Deposit" button for active vault', () => {
      renderWithTheme(<VaultActionButton vault={mockVault} />)
      expect(screen.getByText("Deposit")).toBeInTheDocument()
    })

    it('should render "Enter Withdrawal" button for withdrawals-only vault', () => {
      const withdrawalVault = {
        ...mockVault,
        status: "withdrawals-only" as const,
      }
      renderWithTheme(<VaultActionButton vault={withdrawalVault} />)
      expect(screen.getByText("Enter Withdrawal")).toBeInTheDocument()
    })

    it('should render "Paused" button for paused vault', () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithTheme(<VaultActionButton vault={pausedVault} />)
      expect(screen.getByText("Paused")).toBeInTheDocument()
    })

    it('should render "Switch network" button when on wrong chain', () => {
      // Mock useAccount to return different chain
      jest.doMock("wagmi", () => ({
        useAccount: () => ({
          address: "0x1234567890123456789012345678901234567890",
          isConnected: true,
          chain: { id: 137, name: "Polygon" }, // Different chain
        }),
        useSwitchChain: () => ({
          switchChainAsync: jest.fn(),
        }),
      }))

      renderWithTheme(<VaultActionButton vault={mockVault} />)
      expect(screen.getByText("Switch network")).toBeInTheDocument()
    })
  })

  describe("Button Interactions", () => {
    it("should call onAction when Deposit button is clicked", async () => {
      renderWithTheme(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit")
      fireEvent.click(depositButton)

      await waitFor(() => {
        expect(mockVault.onAction).toHaveBeenCalled()
      })
    })

    it("should call onAction when Enter Withdrawal button is clicked", async () => {
      const withdrawalVault = {
        ...mockVault,
        status: "withdrawals-only" as const,
      }
      renderWithTheme(<VaultActionButton vault={withdrawalVault} />)

      const withdrawalButton = screen.getByText("Enter Withdrawal")
      fireEvent.click(withdrawalButton)

      await waitFor(() => {
        expect(mockVault.onAction).toHaveBeenCalled()
      })
    })

    it("should not call onAction when Paused button is clicked", async () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithTheme(<VaultActionButton vault={pausedVault} />)

      const pausedButton = screen.getByText("Paused")
      fireEvent.click(pausedButton)

      await waitFor(() => {
        expect(mockVault.onAction).not.toHaveBeenCalled()
      })
    })
  })

  describe("Button Styling", () => {
    it("should have correct styling for Deposit button (BaseButton)", () => {
      renderWithTheme(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit")
      expect(depositButton).toHaveClass("chakra-button")
      // Check for gradient background (BaseButton styling)
      expect(depositButton).toHaveStyle({
        background: expect.stringContaining("gradient"),
      })
    })

    it("should have correct styling for Enter Withdrawal button (SecondaryButton)", () => {
      const withdrawalVault = {
        ...mockVault,
        status: "withdrawals-only" as const,
      }
      renderWithTheme(<VaultActionButton vault={withdrawalVault} />)

      const withdrawalButton = screen.getByText("Enter Withdrawal")
      expect(withdrawalButton).toHaveClass("chakra-button")
      // Check for outline styling (SecondaryButton styling)
      expect(withdrawalButton).toHaveAttribute(
        "data-variant",
        "outline"
      )
    })

    it("should have correct styling for Switch network button (BaseButton)", () => {
      // Mock useAccount to return different chain
      jest.doMock("wagmi", () => ({
        useAccount: () => ({
          address: "0x1234567890123456789012345678901234567890",
          isConnected: true,
          chain: { id: 137, name: "Polygon" },
        }),
        useSwitchChain: () => ({
          switchChainAsync: jest.fn(),
        }),
      }))

      renderWithTheme(<VaultActionButton vault={mockVault} />)

      const switchButton = screen.getByText("Switch network")
      expect(switchButton).toHaveClass("chakra-button")
      // Check for gradient background (BaseButton styling)
      expect(switchButton).toHaveStyle({
        background: expect.stringContaining("gradient"),
      })
    })
  })

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      renderWithTheme(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit")
      expect(depositButton).toHaveAttribute("role", "button")
      expect(depositButton).not.toBeDisabled()
    })

    it("should be disabled when vault is paused", () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithTheme(<VaultActionButton vault={pausedVault} />)

      const pausedButton = screen.getByText("Paused")
      expect(pausedButton).toBeDisabled()
    })

    it("should handle keyboard navigation", () => {
      renderWithTheme(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit")

      // Test Enter key
      fireEvent.keyDown(depositButton, {
        key: "Enter",
        code: "Enter",
      })
      expect(mockVault.onAction).toHaveBeenCalled()

      // Test Space key
      fireEvent.keyDown(depositButton, { key: " ", code: "Space" })
      expect(mockVault.onAction).toHaveBeenCalledTimes(2)
    })
  })

  describe("Error Handling", () => {
    it("should handle missing vault config gracefully", () => {
      const vaultWithoutConfig = { status: "active" as const }

      expect(() => {
        renderWithTheme(
          <VaultActionButton vault={vaultWithoutConfig} />
        )
      }).not.toThrow()
    })

    it("should handle missing chain config gracefully", () => {
      const vaultWithoutChain = {
        status: "active" as const,
        config: {},
      }

      expect(() => {
        renderWithTheme(
          <VaultActionButton vault={vaultWithoutChain} />
        )
      }).not.toThrow()
    })

    it("should handle missing onAction callback gracefully", () => {
      const vaultWithoutAction = {
        status: "active" as const,
        config: {
          chain: {
            wagmiId: 1,
            displayName: "Ethereum",
          },
        },
      }

      expect(() => {
        renderWithTheme(
          <VaultActionButton vault={vaultWithoutAction} />
        )
      }).not.toThrow()
    })
  })
})

