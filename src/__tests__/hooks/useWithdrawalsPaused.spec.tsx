import { renderHook, waitFor } from "@testing-library/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactNode } from "react"

const mockFetchStatus = jest.fn()
jest.mock("queries/get-withdrawal-status", () => ({
  fetchWithdrawalStatus: (...a: unknown[]) => mockFetchStatus(...a),
}))

import { useWithdrawalsPaused } from "data/hooks/useWithdrawalsPaused"

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe("useWithdrawalsPaused", () => {
  it("never warns for a vault off the watch list, and does not probe", () => {
    const { result } = renderHook(
      () => useWithdrawalsPaused("Real-Yield-USD"),
      { wrapper }
    )
    expect(result.current).toBe(false)
    expect(mockFetchStatus).not.toHaveBeenCalled()
  })

  it("warns while the probe is still in flight", () => {
    mockFetchStatus.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(
      () => useWithdrawalsPaused("Real-Yield-ETH"),
      { wrapper }
    )
    expect(result.current).toBe(true)
  })

  it("clears itself once the vault becomes redeemable again", async () => {
    mockFetchStatus.mockResolvedValue({
      cellarId: "Real-Yield-ETH",
      paused: false,
      reason: "redeemable",
    })
    const { result } = renderHook(
      () => useWithdrawalsPaused("Real-Yield-ETH"),
      { wrapper }
    )
    await waitFor(() => expect(result.current).toBe(false))
  })

  it("keeps warning while previewRedeem still reverts", async () => {
    mockFetchStatus.mockResolvedValue({
      cellarId: "Turbo-STETH",
      paused: true,
      reason: "reverts",
    })
    const { result } = renderHook(
      () => useWithdrawalsPaused("Turbo-STETH"),
      { wrapper }
    )
    await waitFor(() => expect(result.current).toBe(true))
  })

  it("fails safe to warning when the probe errors", async () => {
    mockFetchStatus.mockRejectedValue(new Error("network down"))
    const { result } = renderHook(
      () => useWithdrawalsPaused("Real-Yield-ETH"),
      { wrapper }
    )
    await waitFor(() => expect(result.current).toBe(true))
  })
})
