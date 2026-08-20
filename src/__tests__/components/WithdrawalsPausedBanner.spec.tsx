import { render, screen } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import { WithdrawalsPausedBanner } from "components/_banners/WithdrawalsPausedBanner"

const renderBanner = () =>
  render(
    <ChakraProvider>
      <WithdrawalsPausedBanner />
    </ChakraProvider>
  )

describe("WithdrawalsPausedBanner", () => {
  it("states that withdrawals are unavailable", () => {
    renderBanner()
    expect(
      screen.getByText(/Withdrawals temporarily unavailable/i)
    ).toBeInTheDocument()
  })

  it("names both affected vaults and reassures on fund safety", () => {
    renderBanner()
    const body = screen.getByText(/stale price oracle/i)
    expect(body).toHaveTextContent(/Real Yield ETH/)
    expect(body).toHaveTextContent(/Turbo stETH/)
    expect(body).toHaveTextContent(/funds are safe/i)
  })

  it("links to the status account", () => {
    renderBanner()
    const link = screen.getByRole("link", { name: /@sommfinance/i })
    expect(link).toHaveAttribute("href", "https://x.com/sommfinance")
  })
})
