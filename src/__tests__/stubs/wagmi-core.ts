// Stub for wagmi core
export const createConfig = jest.fn(() => ({
  chains: [],
  connectors: [],
  transports: {},
}))

export const http = jest.fn(() => ({
  transport: 'http',
  url: 'http://localhost:8545',
}))

export const createPublicClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  publicActions: {},
}))

export const createWalletClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  account: '0x1234567890123456789012345678901234567890',
  walletActions: {},
}))

export const getPublicClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  publicActions: {},
}))

export const getWalletClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  account: '0x1234567890123456789012345678901234567890',
  walletActions: {},
}))

export const usePublicClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  publicActions: {},
}))

export const useWalletClient = jest.fn(() => ({
  transport: 'http',
  chain: { id: 1 },
  account: '0x1234567890123456789012345678901234567890',
  walletActions: {},
}))

export const useAccount = jest.fn(() => ({
  address: '0x1234567890123456789012345678901234567890',
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isReconnecting: false,
  chain: { id: 1 },
  connector: null,
}))

export const useChainId = jest.fn(() => 1)

export const useSwitchChain = jest.fn(() => ({
  switchChain: jest.fn(),
  switchChainAsync: jest.fn(),
  isPending: false,
  error: null,
}))

export const useConnect = jest.fn(() => ({
  connect: jest.fn(),
  connectAsync: jest.fn(),
  connectors: [],
  isPending: false,
  error: null,
}))

export const useDisconnect = jest.fn(() => ({
  disconnect: jest.fn(),
  disconnectAsync: jest.fn(),
  isPending: false,
  error: null,
}))

// Add missing exports that might be imported
export const mainnet = { id: 1, name: 'Ethereum' }
export const arbitrum = { id: 42161, name: 'Arbitrum One' }
export const base = { id: 8453, name: 'Base' }
export const optimism = { id: 10, name: 'OP Mainnet' }
