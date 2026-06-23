import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../../tests/utils/renderWithProviders"
// Mock user balance to ensure zero LP and net value scenario
jest.mock("data/hooks/useUserBalance", () => ({
  useUserBalance: () => ({ lpToken: { data: undefined } }),
}))
// Uses the global wagmi/chains mock (src/__tests__/mocks/wagmi-chains.ts),
// which provides mainnet/arbitrum/optimism/base with blockExplorers as
// chainConfig.ts requires.
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"

describe("Deposit/Withdraw button smoke test", () => {
  it("renders the deposit button for a vault with no balance / zero net value", async () => {
    const row: any = {
      original: {
        slug: "Alpha-stETH",
        deprecated: false,
        launchDate: new Date().toISOString(),
        name: "Real Yield ETH Test",
        // No lpToken balance and zero net value: the component shows the
        // deposit action (there is nothing to withdraw). Withdraw-state
        // behaviour is covered in withdrawState.spec.tsx.
        netValue: 0,
      },
    }

    const onDepositModalOpen = jest.fn()

    renderWithProviders(
      <DepositAndWithdrawButton
        row={row}
        onDepositModalOpen={onDepositModalOpen}
      />
    )

    expect(screen.getByTestId("deposit-btn")).toBeInTheDocument()
    expect(screen.queryByTestId("withdraw-btn")).not.toBeInTheDocument()
  })
})
