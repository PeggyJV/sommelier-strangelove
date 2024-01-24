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
  withdrawQueueAddress: string,
  type: ChainType
}

export enum ChainType {
  L2,
  Cosmos,
  Ethereum
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
    type: ChainType.Ethereum
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
    type: ChainType.L2
  },
  {
    id: "sommelier",
    wagmiId: 0,
    displayName: "Sommelier",
    logoPath: "/assets/images/coin.png",
    alt: "Sommelier logo",
    infuraRpcUrl: "TBA",
    alchemyRpcUrl: "TBA",
    blockExplorer: {url: "TBA", name: "TBA"},
    withdrawQueueAddress: "TBA",
    type: ChainType.Cosmos
  },
  {
    id: "optimism",
    wagmiId: 0,
    displayName: "Optimism",
    logoPath: "/assets/icons/arbitrum.svg",
    alt: "Optimism logo",
    infuraRpcUrl: "TBA",
    alchemyRpcUrl: "TBA",
    blockExplorer: {url: "TBA", name: "TBA"},
    withdrawQueueAddress: "TBA",
    type: ChainType.L2
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
  SOMMELIER: chainConfigMap["sommelier"],
  OPTIMISM: chainConfigMap["optimism"],
}
