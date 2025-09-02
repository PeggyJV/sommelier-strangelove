export const mainnet = {
  id: 1,
  name: "Ethereum",
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
} as any

export const arbitrum = {
  id: 42161,
  name: "Arbitrum One",
  blockExplorers: {
    default: { name: "Arbiscan", url: "https://arbiscan.io" },
  },
} as any

export const optimism = {
  id: 10,
  name: "OP Mainnet",
  blockExplorers: {
    default: {
      name: "Optimistic Etherscan",
      url: "https://optimistic.etherscan.io",
    },
  },
} as any
