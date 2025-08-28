import { render, screen } from "@testing-library/react"
import { DepositAndWithdrawButton } from "../DepositAndWithdrawButton"
import { useAccount } from "wagmi"

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
}))

// Mock the cellarDataMap
jest.mock("data/cellarDataMap", () => ({
  cellarDataMap: {
    "test-vault": {
      config: {
        cellar: { address: "0x123" },
        chain: { id: "ethereum", wagmiId: 1 },
        lpToken: { address: "0x456" },
        baseAsset: { symbol: "ETH" },
      },
    },
    "Alpha-stETH": {
      depositTokens: {
        list: ["ETH", "stETH"],
      },
      config: {
        cellar: { address: "0x789" },
        chain: { id: "ethereum", wagmiId: 1 },
        lpToken: { address: "0xabc" },
        baseAsset: { symbol: "ETH" },
      },
    },
  },
}))

// Mock useUserBalance
jest.mock("data/hooks/useUserBalance", () => ({
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

    const utils = render(
      <DepositAndWithdrawButton
        row={mockRow}
        onDepositModalOpen={jest.fn()}
      />
    )
    return {
      ...utils,
      getBtn: () => utils.getAllByRole("group")[0],
    }
  }

  test("$0.04 → enabled", () => {
    renderWithNetValue({ value: 0.04, formatted: "$0.04" })
    const button = screen.getByRole("group")
    expect(button).not.toBeDisabled()
  })

  test("$0.79 → enabled", () => {
    renderWithNetValue({ value: 0.79, formatted: "$0.79" })
    const button = screen.getByRole("group")
    expect(button).not.toBeDisabled()
  })

  test("$0.00 → disabled", () => {
    renderWithNetValue({ value: 0, formatted: "$0.00" })
    const { getBtn } = renderWithNetValue({
      value: 0,
      formatted: "$0.00",
    })
    expect(getBtn()).toHaveAttribute("disabled")
  })

  test("– → disabled", () => {
    renderWithNetValue("–")
    const { getBtn } = renderWithNetValue("–")
    expect(getBtn()).toHaveAttribute("disabled")
  })

  test("missing → disabled", () => {
    renderWithNetValue(null)
    const { getBtn } = renderWithNetValue(null)
    expect(getBtn()).toHaveAttribute("disabled")
  })

  test("negative → disabled", () => {
    renderWithNetValue({ value: -1, formatted: "-$1.00" })
    const { getBtn } = renderWithNetValue({
      value: -1,
      formatted: "-$1.00",
    })
    expect(getBtn()).toHaveAttribute("disabled")
  })

  test("string $0.04 → enabled", () => {
    renderWithNetValue("$0.04")
    const button = screen.getByRole("group")
    expect(button).not.toBeDisabled()
  })

  test("string $0.00 → disabled", () => {
    renderWithNetValue("$0.00")
    const { getBtn } = renderWithNetValue("$0.00")
    expect(getBtn()).toHaveAttribute("disabled")
  })
})
