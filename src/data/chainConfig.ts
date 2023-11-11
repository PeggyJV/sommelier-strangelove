import {
  mainnet,
} from "wagmi"
import { arbitrum } from "wagmi/chains"

export interface Chain {
  id: string
  wagmiId: number
  blockExplorerUrl: string
  displayName: string
  logoPath: string
  alt: string
  infuraRpcUrl: string
  alchemyRpcUrl: string
}

/**
 *
 *  chainConfig is for storing the all chain data that used in the app
 */
export const chainConfig: Chain[] = [
  {
    id: "ethereum",
    wagmiId: mainnet.id,
    blockExplorerUrl: mainnet.blockExplorers.default.url,
    displayName: "Ethereum",
    logoPath: "/assets/icons/ethereum-alt.png",
    alt: "Ethereum logo",
    infuraRpcUrl: mainnet.rpcUrls.infura.http[0],
    alchemyRpcUrl: mainnet.rpcUrls.alchemy.http[0],
  },
  {
    id: "arbitrum",
    wagmiId: arbitrum.id,
    blockExplorerUrl: arbitrum.blockExplorers.default.url,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.png",
    alt: "Arbitrum logo",
    infuraRpcUrl: arbitrum.rpcUrls.infura.http[0],
    alchemyRpcUrl: arbitrum.rpcUrls.alchemy.http[0],
  },
]

// Create a map from each chain name to its config
export const chainConfigMap = chainConfig.reduce((map, chain) => {
  map[chain.id] = chain
  return map
}, {} as { [id: string]: Chain })

export const supportedChains = ["ethereum", "arbitrum"]

export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
}
