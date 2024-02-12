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
      "0x1DF1A219562C643163aF1e5CD1d50b0fD67D21da",
    priceRouterAddress: "" // TODO: Add once deployed
  },
]

// Create a map from each chain name to its config
export const chainConfigMap = chainConfig.reduce((map, chain) => {
  map[chain.id] = chain
  return map
}, {} as { [id: string]: Chain })

export const supportedChains = [
  "ethereum", 
  // TODO: Enable for multichain
  "arbitrum"
]

export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
}
