import React from "react";
import { WagmiConfig } from "wagmi";
import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../src/theme";

// Mock config from our lib-wagmi mock
const mockConfig = {
  chains: [
    { id: 1, name: "Ethereum" },
    { id: 42161, name: "Arbitrum" },
    { id: 8453, name: "Base" },
  ],
  connectors: [],
  transports: {},
};

export const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ChakraProvider theme={theme}>
      <WagmiConfig config={mockConfig as any}>
        {ui}
      </WagmiConfig>
    </ChakraProvider>
  );

