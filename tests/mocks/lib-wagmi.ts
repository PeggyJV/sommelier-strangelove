// Mock the app's wagmi config/chains the component tree expects.
export const chains = {
  mainnet: { id: 1, name: "Ethereum" },
  arbitrum: { id: 42161, name: "Arbitrum" },
  base: { id: 8453, name: "Base" },
};

export const config = { 
  chains: Object.values(chains),
  connectors: [],
  transports: {},
};

export const publicClient = { 
  chain: chains.mainnet,
  transport: 'http',
  publicActions: {},
};

export const walletClient = null;

