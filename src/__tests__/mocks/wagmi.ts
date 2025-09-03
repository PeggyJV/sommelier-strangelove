export function usePublicClient() {
  return { chain: { id: 1 }, transport: { type: "http" } } as any
}

export function useWalletClient() {
  return { account: { address: "0xabc" } } as any
}

export const WagmiConfig = ({ children }: any) => children

export function createConfig(_: any) {
  return {}
}

export const connectors = {
  walletConnect: (opts?: any) => ({
    id: "walletConnect",
    type: "injected",
    ...opts,
  }),
}

export function configureChains(_: any, __: any) {
  return {
    chains: [],
    publicClient: {},
    webSocketPublicClient: {},
  } as any
}

export function http() {
  return () => ({})
}

export function useAccount() {
  return {
    address: "0xabc",
    isConnected: true,
    chain: { id: 1, name: "Ethereum" },
  }
}
