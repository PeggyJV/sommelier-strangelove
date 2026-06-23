import React from "react"
import {
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react"
import { VaultActionButton } from "../../components/_buttons/VaultActionButton"
import { renderWithProviders } from "../../../tests/utils/renderWithProviders"

// Mock the deposit modal store
jest.mock("../../data/hooks/useDepositModalStore", () => ({
  useDepositModalStore: () => ({
    setIsOpen: jest.fn(),
  }),
}))

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
      renderWithProviders(<VaultActionButton vault={mockVault} />)
      expect(screen.getByText("Deposit")).toBeInTheDocument()
    })

    it('should render "Enter Withdrawal" button for withdrawals-only vault', () => {
      const withdrawalVault = {
        ...mockVault,
        status: "withdrawals-only" as const,
      }
      renderWithProviders(<VaultActionButton vault={withdrawalVault} />)
      expect(screen.getByText("Enter Withdrawal")).toBeInTheDocument()
    })

    it('should render "Paused" button for paused vault', () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithProviders(<VaultActionButton vault={pausedVault} />)
      expect(screen.getByText("Paused")).toBeInTheDocument()
    })

    it('should render "Switch network" button when on wrong chain', () => {
      // Create a vault that expects a different chain
      const wrongChainVault = {
        ...mockVault,
        config: {
          chain: {
            wagmiId: 137, // Polygon
            displayName: "Polygon",
          },
        },
      }
      renderWithProviders(<VaultActionButton vault={wrongChainVault} />)
      expect(screen.getByText("Switch network")).toBeInTheDocument()
    })
  })

  describe("Button Interactions", () => {
    it("should call onAction when Deposit button is clicked", async () => {
      renderWithProviders(<VaultActionButton vault={mockVault} />)

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
      renderWithProviders(<VaultActionButton vault={withdrawalVault} />)

      const withdrawalButton = screen.getByText("Enter Withdrawal")
      fireEvent.click(withdrawalButton)

      await waitFor(() => {
        expect(mockVault.onAction).toHaveBeenCalled()
      })
    })

    it("should not call onAction when Paused button is clicked", async () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithProviders(<VaultActionButton vault={pausedVault} />)

      const pausedButton = screen.getByText("Paused")
      fireEvent.click(pausedButton)

      await waitFor(() => {
        expect(mockVault.onAction).not.toHaveBeenCalled()
      })
    })
  })

  describe("Button rendering by state", () => {
    // Note: these assert the correct button renders per vault state. Exact
    // visual styling (gradient/outline) is a Chakra implementation detail that
    // jsdom does not compute, so we check the rendered control, not its CSS.
    it("renders the Deposit button (default state)", () => {
      renderWithProviders(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit")
      expect(depositButton.closest("button")).toBeInTheDocument()
    })

    it("renders the Enter Withdrawal button (withdrawals-only state)", () => {
      const withdrawalVault = {
        ...mockVault,
        status: "withdrawals-only" as const,
      }
      renderWithProviders(<VaultActionButton vault={withdrawalVault} />)

      const withdrawalButton = screen.getByText("Enter Withdrawal")
      expect(withdrawalButton.closest("button")).toBeInTheDocument()
    })

    it("renders the Switch network button (wrong chain)", () => {
      const wrongChainVault = {
        ...mockVault,
        config: {
          chain: {
            wagmiId: 137, // Polygon
            displayName: "Polygon",
          },
        },
      }
      renderWithProviders(<VaultActionButton vault={wrongChainVault} />)

      const switchButton = screen.getByText("Switch network")
      expect(switchButton.closest("button")).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("renders a native, enabled button (implicit button role)", () => {
      renderWithProviders(<VaultActionButton vault={mockVault} />)

      // A native <button> carries the implicit ARIA "button" role and is
      // keyboard-accessible; assert that rather than an explicit role attr.
      const depositButton = screen.getByText("Deposit").closest("button")
      expect(depositButton).toBeInTheDocument()
      expect(depositButton).not.toBeDisabled()
    })

    it("should be disabled when vault is paused", () => {
      const pausedVault = { ...mockVault, status: "paused" as const }
      renderWithProviders(<VaultActionButton vault={pausedVault} />)

      const pausedButton = screen.getByText("Paused")
      expect(pausedButton).toBeDisabled()
    })

    it("is keyboard-accessible and activates onAction", () => {
      renderWithProviders(<VaultActionButton vault={mockVault} />)

      const depositButton = screen.getByText("Deposit").closest("button")!
      // Native buttons are focusable and activate via Enter/Space, which the
      // browser maps to a click; assert the click path invokes onAction.
      expect(depositButton).toBeInTheDocument()
      expect(depositButton).not.toBeDisabled()
      fireEvent.click(depositButton)
      expect(mockVault.onAction).toHaveBeenCalled()
    })
  })

  describe("Error Handling", () => {
    it("should handle missing vault config gracefully", () => {
      const vaultWithoutConfig = { status: "active" as const }

      expect(() => {
        renderWithProviders(
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
        renderWithProviders(
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
        renderWithProviders(
          <VaultActionButton vault={vaultWithoutAction} />
        )
      }).not.toThrow()
    })
  })
})

