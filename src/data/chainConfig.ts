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
    logoPath: "/assets/icons/eth.png",
    alt: "Ethereum logo",
  },
  {
    id: "arbitrum",
    wagmiId: arbitrum.id,
    blockExplorerUrl: arbitrum.blockExplorers.default.url,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.png",
    alt: "Arbitrum logo",
  },
]

// Create a map from each chain name to its config
export const chainConfigMap = chainConfig.reduce((map, chain) => {
  map[chain.id] = chain
  return map
}, {} as { [id: string]: Chain })

export const supportedChains = ["ethereum", "arbitrum"]
