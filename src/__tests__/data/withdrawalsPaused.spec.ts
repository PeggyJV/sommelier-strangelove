import {
  WITHDRAWALS_PAUSED_SLUGS,
  isWithdrawalsPaused,
} from "data/withdrawalsPaused"
import { config as utilConfig } from "utils/config"

describe("withdrawalsPaused", () => {
  it("flags Real Yield ETH and Turbo stETH", () => {
    expect(
      isWithdrawalsPaused(utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG)
    ).toBe(true)
    expect(
      isWithdrawalsPaused(utilConfig.CONTRACT.TURBO_STETH.SLUG)
    ).toBe(true)
  })

  it("does not flag unaffected vaults", () => {
    expect(
      isWithdrawalsPaused(utilConfig.CONTRACT.ALPHA_STETH.SLUG)
    ).toBe(false)
    expect(isWithdrawalsPaused("Real-Yield-USD")).toBe(false)
  })

  it("handles a missing slug", () => {
    expect(isWithdrawalsPaused(undefined)).toBe(false)
    expect(isWithdrawalsPaused("")).toBe(false)
  })

  it("resolves to the real route slugs", () => {
    expect(WITHDRAWALS_PAUSED_SLUGS).toEqual([
      "Real-Yield-ETH",
      "Turbo-STETH",
    ])
  })
})
