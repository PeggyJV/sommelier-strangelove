import { Chain } from "src/data/chainConfig"
import { createPublicClient, getAddress, getContract, PublicClient } from "viem"
import { http } from "wagmi"

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY
export const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_KEY

export const ALCHEMY_API_URL = {
  ethereum: "https://eth-mainnet.alchemyapi.io/v2",
  arbitrum: "https://arb-mainnet.alchemyapi.io/v2",
  optimism: "https://opt-mainnet.alchemyapi.io/v2"
}
export const INFURA_API_URL = {
  ethereum: "https://mainnet.infura.io/v3",
  arbitrum: "https://arbitrum-mainnet.infura.io/v3",
  optimism: "https://optimism-mainnet.infura.io/v3"
}

export const QUICKNODE_API_URL = {
  scroll: "https://damp-cool-model.scroll-mainnet.quiknode.pro/"
}
export async function getActiveProvider(chain: Chain) {
  let publicClient: PublicClient | null = null

  if (chain.quicknodeRpcUrl && QUICKNODE_API_KEY) {
    publicClient = createPublicClient({
      chain: chain.viemChain,
      transport: http(`${chain.quicknodeRpcUrl}/${QUICKNODE_API_KEY}`)
    })
    console.log("Attempting to connect via Quicknode...")
  } else if (chain.alchemyRpcUrl && ALCHEMY_API_KEY) {
    publicClient = createPublicClient({
      chain: chain.viemChain,
      transport: http(`${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`)
    })
    console.log("Attempting to connect via Alchemy...")
  } else if (chain.infuraRpcUrl && INFURA_API_KEY) {
    publicClient = createPublicClient({
      chain: chain.viemChain,
      transport: http(`${chain.infuraRpcUrl}/${INFURA_API_KEY}`)
    })

    console.log("Attempting to connect via Infura...")
  }

  // Attempt to connect using the configured provider
  try {
    await publicClient?.getBlockNumber()
    console.log("Connected to provider")
    return publicClient
  } catch (error) {
    console.error("Failed to connect to any provider!", error)
    return null
  }
}

export async function queryContract(
  contractAddress: string,
  abi: readonly {}[],
  chain: Chain
) {
  const publicClient = await getActiveProvider(chain)

  if (!publicClient) {
    console.error("No provider is available!")
    return null
  }

  const contract = getContract({
    abi,
    address: getAddress(contractAddress),
    client: publicClient
  })
  return contract
}
