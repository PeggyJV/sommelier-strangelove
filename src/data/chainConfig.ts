import { mainnet, arbitrum, optimism } from "wagmi/chains"
import { Chain as ViemChain } from "viem"
import {
  ALCHEMY_API_URL,
  INFURA_API_URL,
  QUICKNODE_API_URL,
} from "context/rpc_context"

export interface Chain {
  id: string
  viemId: string
  viemChain: ViemChain
  wagmiId: 10 | 1 | 42161
  displayName: string
  logoPath: string
  alt: string
  infuraRpcUrl?: string
  alchemyRpcUrl?: string
  quicknodeRpcUrl?: string
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
  viemId: "",
  wagmiId: 1,
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
    viemId: "Ethereum",
    viemChain: mainnet,
    wagmiId: mainnet.id,
    displayName: "Ethereum",
    logoPath: "/assets/icons/ethereum-alt.png",
    alt: "Ethereum logo",
    infuraRpcUrl: INFURA_API_URL.ethereum,
    alchemyRpcUrl: ALCHEMY_API_URL.ethereum,
    blockExplorer: mainnet.blockExplorers.default,
    withdrawQueueAddress:
      "0x5751d75b642975E4E7fdE39f35F9a6c11b867169",
    priceRouterAddress: "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92",
    quicknodeRpcUrl: "",
  },
  {
    id: "arbitrum",
    viemId: "Arbitrum One",
    viemChain: arbitrum,
    wagmiId: arbitrum.id,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.svg",
    alt: "Arbitrum logo",
    infuraRpcUrl: INFURA_API_URL.arbitrum,
    alchemyRpcUrl: ALCHEMY_API_URL.arbitrum,
    blockExplorer: arbitrum.blockExplorers.default,
    withdrawQueueAddress:
      "0x516AD60801b62fCABCCDA7be178e4478D4018071",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
  },
  {
    id: "optimism",
    viemId: "OP Mainnet",
    viemChain: optimism,
    wagmiId: optimism.id,
    displayName: "Optimism",
    logoPath: "/assets/icons/optimism.svg",
    alt: "Optimism logo",
    infuraRpcUrl: INFURA_API_URL.optimism,
    alchemyRpcUrl: ALCHEMY_API_URL.optimism,
    blockExplorer: optimism.blockExplorers.default,
    withdrawQueueAddress:
      "0x516AD60801b62fCABCCDA7be178e4478D4018071",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
  },
  // Scroll removed per requirements
]

export const chainConfigMap: Record<string, Chain> =
  chainConfig.reduce<Record<string, Chain>>(
    (map, chain) => {
      map[chain.id] = chain
      return map
    },
    { unknown: placeholderChain }
  )

export const supportedChains = ["ethereum", "arbitrum", "optimism"]

export const getChainByViemId = (viemId: string | undefined) =>
  chainConfig.find((c) => c.viemId === viemId) ??
  chainSlugMap.ETHEREUM
export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
  OPTIMISM: chainConfigMap["optimism"],
}
