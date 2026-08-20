import { render, screen } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import { StrategyDashboardLink } from "components/_cards/PortfolioCard/StrategyDashboardLink"

const renderLink = (props: {
  href?: string
  name?: string
  isLoading: boolean
}) =>
  render(
    <ChakraProvider>
      <StrategyDashboardLink {...props} />
    </ChakraProvider>
  )

describe("StrategyDashboardLink", () => {
  it("shows a spinner only while loading", () => {
    const { container } = renderLink({
      href: "https://example.com",
      name: "Real Yield ETH",
      isLoading: true,
    })
    expect(container.querySelector(".chakra-spinner")).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("links using static config even when strategy data never arrives", () => {
    renderLink({
      href: "https://example.com/dash",
      name: "Real Yield ETH",
      isLoading: false,
    })
    const link = screen.getByRole("link", { name: /Real Yield ETH/ })
    expect(link).toHaveAttribute("href", "https://example.com/dash")
  })

  it("falls back to -- when there is no dashboard configured", () => {
    renderLink({ href: undefined, name: "Real Yield ETH", isLoading: false })
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.getByText("--")).toBeInTheDocument()
  })

  it("never renders the literal string Loading...", () => {
    renderLink({ href: "https://example.com", name: "X", isLoading: false })
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  })
})
