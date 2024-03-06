import { mainnet } from "wagmi"
import { arbitrum } from "wagmi/chains"

export interface Chain {
  id: string
  wagmiId: number
  displayName: string
  logoPath: string
  alt: string
  infuraRpcUrl: string
  alchemyRpcUrl: string
  blockExplorer: {
    name: string
    url: string
  }
  withdrawQueueAddress: string
  priceRouterAddress: string
}

export const placeholderChain: Chain = {
  id: "unknown",
  wagmiId: 0,
  displayName: "Chain (Unsupported)",
  logoPath: "/assets/icons/unknownchain.svg",
  alt: "Placeholder logo",
  infuraRpcUrl: "",
  alchemyRpcUrl: "",
  blockExplorer: {
    name: "Unknown",
    url: "#",
  },
  withdrawQueueAddress: "",
  priceRouterAddress: "",
}
/**
 *
 *  chainConfig is for storing the all chain data that used in the app
 */
export const chainConfig: Chain[] = [
  {
    id: "ethereum",
    wagmiId: mainnet.id,
    displayName: "Ethereum",
    logoPath: "/assets/icons/ethereum-alt.png",
    alt: "Ethereum logo",
    infuraRpcUrl: mainnet.rpcUrls.infura.http[0],
    alchemyRpcUrl: mainnet.rpcUrls.alchemy.http[0],
    blockExplorer: mainnet.blockExplorers.default,
    withdrawQueueAddress:
      "0x5751d75b642975E4E7fdE39f35F9a6c11b867169",
    priceRouterAddress: "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92",
  },
  {
    id: "arbitrum",
    wagmiId: arbitrum.id,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.svg",
    alt: "Arbitrum logo",
    infuraRpcUrl: arbitrum.rpcUrls.infura.http[0],
    alchemyRpcUrl: arbitrum.rpcUrls.alchemy.http[0],
    blockExplorer: arbitrum.blockExplorers.default,
    withdrawQueueAddress:
      "0x516AD60801b62fCABCCDA7be178e4478D4018071",
    priceRouterAddress: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
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
export const supportedChains = ["ethereum", "arbitrum"]

export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
}
