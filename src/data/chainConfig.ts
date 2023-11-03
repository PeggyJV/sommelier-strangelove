export interface Chain {
  key: string
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
    key: "ethereum",
    displayName: "Ethereum",
    logoPath: "/assets/icons/eth.png",
    alt: "Ethereum logo",
  },
  {
    key: "arbitrum" ,
    displayName: "Arbitrum",
    logoPath: "/assets/icons/arbitrum.png",
    alt: "Arbitrum logo",
  }
]

// Create a map from each chain name to its config
export const chainConfigMap = chainConfig.reduce((map, chain) => {
  map[chain.key] = chain
  return map
}, {} as { [key: string]: Chain })

export const supportedChains = [
  "ethereum",
  "arbitrum",
]
