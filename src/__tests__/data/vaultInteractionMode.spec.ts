import {
  getVaultInteractionMode,
  isOrdinaryDepositEnabled,
  isOrdinaryWithdrawalEnabled,
} from "data/vaultInteractionMode"

describe("vaultInteractionMode", () => {
  it("puts legacy vaults in withdrawal-only mode", () => {
    expect(getVaultInteractionMode("Real-Yield-USD-Arbitrum")).toBe(
      "withdrawal-only"
    )
    expect(isOrdinaryDepositEnabled("Real-Yield-USD-Arbitrum")).toBe(
      false
    )
    expect(
      isOrdinaryWithdrawalEnabled("Real-Yield-USD-Arbitrum")
    ).toBe(true)
  })

  it("puts Alpha stETH in migration-only mode", () => {
    expect(getVaultInteractionMode("Alpha-stETH")).toBe(
      "migration-only"
    )
    expect(isOrdinaryDepositEnabled("Alpha-stETH")).toBe(false)
    expect(isOrdinaryWithdrawalEnabled("Alpha-stETH")).toBe(false)
  })
})
