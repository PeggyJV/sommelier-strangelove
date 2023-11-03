export interface Chain {
  id: string
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
    displayName: "Ethereum",
    logoPath: "/assets/icons/eth.png",
    alt: "Ethereum logo",
  },
  {
    id: "arbitrum",
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

export const supportedChains = [
  "ethereum",
  "arbitrum",
]
