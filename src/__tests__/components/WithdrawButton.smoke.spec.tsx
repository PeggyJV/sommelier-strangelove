import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../../tests/utils/renderWithProviders"
// Mock user balance to ensure zero LP and net value scenario
jest.mock("data/hooks/useUserBalance", () => ({
  useUserBalance: () => ({ lpToken: { data: undefined } }),
}))
import { DepositAndWithdrawButton } from "components/_buttons/DepositAndWithdrawButton"

describe("Withdraw button smoke test", () => {
  it("renders withdraw button testid and is disabled for zero net value", async () => {
    const row: any = {
      original: {
        slug: "Alpha-stETH",
        deprecated: false,
        launchDate: new Date().toISOString(),
        name: "Real Yield ETH Test",
        // no lpToken balance mocked; netValue 0 ensures disabled
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

    const btn = screen.getByTestId("withdraw-btn")
    expect(btn).toBeDisabled()
  })
})


