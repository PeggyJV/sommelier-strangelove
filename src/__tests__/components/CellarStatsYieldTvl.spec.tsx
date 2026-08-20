import { render, screen } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"

const mockUseStrategyData = jest.fn()
jest.mock("data/hooks/useStrategyData", () => ({
  useStrategyData: (...args: unknown[]) => mockUseStrategyData(...args),
}))

import { CellarStatsYield } from "components/CellarStatsYield"

const CELLAR_ID = "Real-Yield-ETH"

const renderStats = () =>
  render(
    <ChakraProvider>
      <CellarStatsYield cellarId={CELLAR_ID} />
    </ChakraProvider>
  )

describe("CellarStatsYield TVL", () => {
  it("spins only while the strategy query is actually loading", () => {
    mockUseStrategyData.mockReturnValue({
      data: undefined,
      isLoading: true,
    })
    const { container } = renderStats()
    expect(
      container.querySelector(".chakra-spinner")
    ).toBeInTheDocument()
  })

  it("falls back to -- when the query has settled with no TVL", () => {
    // data_pending upstream: the query is disabled/settled, tvm never arrives.
    mockUseStrategyData.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    const { container } = renderStats()
    expect(
      container.querySelector(".chakra-spinner")
    ).not.toBeInTheDocument()
    expect(screen.getByText("--")).toBeInTheDocument()
  })

  it("renders the formatted TVL when present", () => {
    mockUseStrategyData.mockReturnValue({
      data: { tvm: { formatted: "$1.23M" } },
      isLoading: false,
    })
    renderStats()
    expect(screen.getByText("$1.23M")).toBeInTheDocument()
  })
})
