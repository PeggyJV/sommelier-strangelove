import React from "react"

// Core wagmi exports
export const useAccount = () => ({ 
  address: "0xabc1234567890123456789012345678901234567", 
  isConnected: true,
  chain: { id: 1, name: "Ethereum" }
})

export const useNetwork = () => ({ 
  chain: { id: 1, name: "Ethereum" } 
})

export const useSwitchChain = () => ({ 
  switchChain: async () => ({ id: 1 }),
  switchChainAsync: async () => ({ id: 1 })
})

export const useConnect = () => ({
  connect: jest.fn(),
  connectAsync: jest.fn(),
  connectors: [],
  isPending: false,
  error: null,
})

export const useDisconnect = () => ({
  disconnect: jest.fn(),
  disconnectAsync: jest.fn(),
  isPending: false,
  error: null,
})

export const useChainId = () => 1

export const usePublicClient = () => ({
  transport: 'http',
  chain: { id: 1 },
  publicActions: {},
})

export const useWalletClient = () => ({
  transport: 'http',
  chain: { id: 1 },
  account: '0xabc1234567890123456789012345678901234567',
  walletActions: {},
})

export const getPublicClient = () => ({
  transport: 'http',
  chain: { id: 1 },
  publicActions: {},
})

export const getWalletClient = () => ({
  transport: 'http',
  chain: { id: 1 },
  account: '0xabc1234567890123456789012345678901234567',
  walletActions: {},
})

export const createConfig = (_: any) => ({})
export const createPublicClient = () => ({})
export const createWalletClient = () => ({})
export const http = (_url?: string) => ({} as any)
export const normalizeChainId = (n: number) => n

// Chain exports
export const mainnet = { id: 1, name: "Ethereum" }
export const arbitrum = { id: 42161, name: "Arbitrum One" }
export const base = { id: 8453, name: "Base" }
export const optimism = { id: 10, name: "OP Mainnet" }

// Connector exports
export const walletConnect = () => ({
  id: 'walletConnect',
  name: 'WalletConnect',
  ready: true,
  connect: jest.fn(),
  disconnect: jest.fn(),
  getAccounts: jest.fn(),
  getChainId: jest.fn(),
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isUnsupported: false,
  switchChain: jest.fn(),
  watchAccount: jest.fn(),
  watchChainId: jest.fn(),
  watchConnector: jest.fn(),
  watchDisconnect: jest.fn(),
})

export const injected = () => ({
  id: 'injected',
  name: 'Injected',
  ready: true,
  connect: jest.fn(),
  disconnect: jest.fn(),
  getAccounts: jest.fn(),
  getChainId: jest.fn(),
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isUnsupported: false,
  switchChain: jest.fn(),
  watchAccount: jest.fn(),
  watchChainId: jest.fn(),
  watchConnector: jest.fn(),
  watchDisconnect: jest.fn(),
})

// Provider component
export const WagmiConfig = ({ children }: { children: React.ReactNode }) => <>{children}</>

