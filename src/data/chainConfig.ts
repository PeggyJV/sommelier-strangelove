import {
  mainnet,
  arbitrum,
  optimism,
  scroll,
} from "wagmi/chains"
import { Chain as ViemChain } from "viem";

export interface Chain {
  id: string
  viemChain: ViemChain
  wagmiId: number
  displayName: string
  logoPath: string
  alt: string
  infuraRpcUrl: string
  alchemyRpcUrl: string
  quicknodeRpcUrl: string
  blockExplorer: {
    name: string
    url: string
  }
  withdrawQueueAddress: string
  priceRouterAddress: string
}

export const placeholderChain: Chain = {
  id: "unknown",
  viemChain: mainnet,
  wagmiId: 0,
  displayName: "Switch Chain (Unsupported)",
  logoPath: "/assets/icons/unknownchain.svg",
  alt: "Placeholder logo",
  infuraRpcUrl: "",
  alchemyRpcUrl: "",
  quicknodeRpcUrl: "",
  blockExplorer: {
    name: "Unknown",
    url: "#",
  },
  withdrawQueueAddress: "",
  priceRouterAddress: "",
}

export const chainConfig: Chain[] = [
  {
    id: "ethereum",
    viemChain: mainnet,
    wagmiId: mainnet.id,
    displayName: "Ethereum",
    logoPath: "/assets/icons/ethereum-alt.png",
    alt: "Ethereum logo",
    // Safely access the RPC URLs with a fallback
    infuraRpcUrl:
      mainnet.rpcUrls.default?.http?.[0] ||
      "https://default-ethereum-rpc.com",
    alchemyRpcUrl:
      mainnet.rpcUrls.default?.http?.[0] ||
      "https://default-ethereum-rpc.com",
    blockExplorer: mainnet.blockExplorers.default,
    withdrawQueueAddress:
      "0x5751d75b642975E4E7fdE39f35F9a6c11b867169",
    priceRouterAddress: "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92",
    quicknodeRpcUrl: "",
  },
  {
    id: "arbitrum",
    viemChain: arbitrum,
    wagmiId: arbitrum.id,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.svg",
    alt: "Arbitrum logo",
    // Safely access the Arbitrum RPC URLs
    infuraRpcUrl:
      arbitrum.rpcUrls.default.http?.[0] ||
      "https://default-arbitrum-rpc.com",
    alchemyRpcUrl:
      arbitrum.rpcUrls.default.http?.[0] ||
      "https://default-arbitrum-rpc.com",
    blockExplorer: arbitrum.blockExplorers.default,
    withdrawQueueAddress:
      "0x516AD60801b62fCABCCDA7be178e4478D4018071",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
    quicknodeRpcUrl: "",
  },
  {
    id: "optimism",
    viemChain: optimism,
    wagmiId: optimism.id,
    displayName: "Optimism",
    logoPath: "/assets/icons/optimism.svg",
    alt: "Optimism logo",
    // Safely access the Optimism RPC URLs with checks
    infuraRpcUrl:
      optimism.rpcUrls?.default.http?.[0] ||
      "https://default-optimism-rpc.com",
    alchemyRpcUrl:
      optimism.rpcUrls?.default.http?.[0] ||
      "https://default-optimism-rpc.com",
    blockExplorer: optimism.blockExplorers?.default || {
      name: "Unknown",
      url: "#",
    },
    withdrawQueueAddress:
      "0x516AD60801b62fCABCCDA7be178e4478D4018071",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
    quicknodeRpcUrl: "",
  },
  {
    id: "scroll",
    viemChain: scroll,
    wagmiId: scroll.id,
    displayName: "Scroll",
    logoPath: "/assets/icons/scroll.svg",
    alt: "Scroll logo",
    quicknodeRpcUrl:
      "https://damp-cool-model.scroll-mainnet.quiknode.pro",
    blockExplorer: scroll.blockExplorers.default,
    withdrawQueueAddress:
      "0x1cee7dfb56de1eae6125e39336e94f297b94959e",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
    infuraRpcUrl: "",
    alchemyRpcUrl: "",
  },
]

// Create a map from each chain name to its config, including the placeholder
export const chainConfigMap: Record<string, Chain> =
  chainConfig.reduce<Record<string, Chain>>(
    (map, chain) => {
      map[chain.id] = chain
      return map
    },
    { unknown: placeholderChain }
  )
export const supportedChains = [
  "ethereum",
  "arbitrum",
  "optimism",
  "scroll",
]

export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
  OPTIMISM: chainConfigMap["optimism"],
  SCROLL: chainConfigMap["scroll"],
}
