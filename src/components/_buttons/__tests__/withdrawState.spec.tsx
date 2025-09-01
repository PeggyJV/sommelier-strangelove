import React from "react"
import { render, screen } from "@testing-library/react"
import { useAccount } from "wagmi"
import { DepositAndWithdrawButton } from "../DepositAndWithdrawButton"
import { renderWithProviders } from "../../../../tests/utils/renderWithProviders"

// Mock the deposit modal store
jest.mock("../../../data/hooks/useDepositModalStore", () => ({
  useDepositModalStore: () => ({
    setIsOpen: jest.fn(),
  }),
}))

// Mock the user balance hook
jest.mock("../../../data/hooks/useUserBalance", () => ({
  useUserBalance: () => ({
    lpToken: { data: { formatted: "0", value: 0n, decimals: 18 } },
  }),
}))

describe("Withdrawal Button State", () => {
  const mockUseAccount = useAccount as jest.MockedFunction<
    typeof useAccount
  >

  beforeEach(() => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      chain: { id: 1 },
    } as any)
  })

  const renderWithNetValue = (netValue: any) => {
    const mockRow = {
      original: {
        name: "Test Vault",
        slug: "test-vault",
        deprecated: false,
        isContractNotReady: false,
        launchDate: "2023-01-01",
        netValue: netValue,
        userStrategyData: {
          userData: {
            netValue: netValue,
          },
        },
      },
    }

    const utils = renderWithProviders(
      <DepositAndWithdrawButton
        row={mockRow}
        onDepositModalOpen={jest.fn()}
      />
    )
    return {
      ...utils,
      getBtn: () => utils.getByTestId("withdraw-btn"),
    }
  }

  test("$0.04 → enabled", () => {
    renderWithNetValue({ value: 0.04, formatted: "$0.04" })
    const button = screen.getByTestId("withdraw-btn")
    expect(button).not.toBeDisabled()
  })

  test("$0.79 → enabled", () => {
    renderWithNetValue({ value: 0.79, formatted: "$0.79" })
    const button = screen.getByTestId("withdraw-btn")
    expect(button).not.toBeDisabled()
  })

  test("$0.00 → disabled", () => {
    renderWithNetValue({ value: 0, formatted: "$0.00" })
    const button = screen.getByTestId("withdraw-btn")
    expect(button).toBeDisabled()
  })

  test("– → disabled", () => {
    renderWithNetValue("–")
    const button = screen.getByTestId("withdraw-btn")
    expect(button).toBeDisabled()
  })

  test("missing → disabled", () => {
    renderWithNetValue(null)
    const button = screen.getByTestId("withdraw-btn")
    expect(button).toBeDisabled()
  })

  test("negative → disabled", () => {
    renderWithNetValue({ value: -1, formatted: "-$1.00" })
    const button = screen.getByTestId("withdraw-btn")
    expect(button).toBeDisabled()
  })

  test("string $0.04 → enabled", () => {
    renderWithNetValue("$0.04")
    const button = screen.getByTestId("withdraw-btn")
    expect(button).not.toBeDisabled()
  })

  test("string $0.00 → disabled", () => {
    renderWithNetValue("$0.00")
    const button = screen.getByTestId("withdraw-btn")
    expect(button).toBeDisabled()
  })
})
