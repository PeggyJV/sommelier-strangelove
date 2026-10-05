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

  it("explains the live redemption gate", () => {
    renderBanner()
    const body = screen.getByText(/live withdrawal check/i)
    expect(body).toHaveTextContent(/redemption preview succeeds/i)
    expect(body).toHaveTextContent(/available automatically/i)
  })

  it("links to the status account", () => {
    renderBanner()
    const link = screen.getByRole("link", { name: /@sommfinance/i })
    expect(link).toHaveAttribute("href", "https://x.com/sommfinance")
  })
})
