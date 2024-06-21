import { Chain } from "src/data/chainConfig"
import { createPublicClient, getAddress, getContract, PublicClient } from "viem"
import { http } from "wagmi"

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY
export const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_KEY

export async function getActiveProvider(chain: Chain) {
  let publicClient: PublicClient | null = null

  // Configure providers based on available URLs in the chain config
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
