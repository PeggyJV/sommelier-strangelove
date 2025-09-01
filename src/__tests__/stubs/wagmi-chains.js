module.exports = {
  mainnet: {
    id: 1,
    name: "Ethereum",
    blockExplorers: { default: { url: "https://etherscan.io" } },
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum One",
    blockExplorers: { default: { url: "https://arbiscan.io" } },
  },
  optimism: {
    id: 10,
    name: "OP Mainnet",
    blockExplorers: {
      default: { url: "https://optimistic.etherscan.io" },
    },
  },
  base: {
    id: 8453,
    name: "Base",
    blockExplorers: { default: { url: "https://basescan.org" } },
  },
}
