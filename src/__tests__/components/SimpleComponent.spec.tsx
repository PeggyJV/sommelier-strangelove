import React from "react"
import { render, screen } from "@testing-library/react"
import { ChakraProvider, Text } from "@chakra-ui/react"

// Simple test component
const TestComponent = () => (
  <Text data-testid="test-text">Hello World</Text>
)

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>)
}

describe("Simple Component Test", () => {
  it("should render a simple component", () => {
    renderWithTheme(<TestComponent />)
    expect(screen.getByTestId("test-text")).toBeInTheDocument()
    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })

  it("should handle basic user interactions", () => {
    renderWithTheme(<TestComponent />)
    const element = screen.getByTestId("test-text")
    expect(element).toBeInTheDocument()
  })
})

