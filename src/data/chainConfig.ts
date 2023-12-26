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
  /*/*"arbitrum"*/
]

export const chainSlugMap = {
  ETHEREUM: chainConfigMap["ethereum"],
  ARBITRUM: chainConfigMap["arbitrum"],
}
