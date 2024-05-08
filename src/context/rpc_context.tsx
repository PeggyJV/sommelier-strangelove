// src/context/rpc_context.tsx
import { Contract, providers } from "ethers"
import { Chain } from "src/data/chainConfig"

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY
export const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_KEY // Assuming you set a Quicknode key in your environment variables

export async function getActiveProvider(chain: Chain) {
  let provider: providers.JsonRpcProvider | null = null

  // Configure providers based on available URLs in the chain config
  if (chain.quicknodeRpcUrl && QUICKNODE_API_KEY) {
    provider = new providers.JsonRpcProvider(
      `${chain.quicknodeRpcUrl}/${QUICKNODE_API_KEY}`
    )
    console.log("Attempting to connect via Quicknode...")
  } else if (chain.alchemyRpcUrl && ALCHEMY_API_KEY) {
    provider = new providers.JsonRpcProvider(
      `${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
    )
    console.log("Attempting to connect via Alchemy...")
  } else if (chain.infuraRpcUrl && INFURA_API_KEY) {
    provider = new providers.JsonRpcProvider(
      `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
    )
    console.log("Attempting to connect via Infura...")
  }

  // Attempt to connect using the configured provider
  try {
    await provider?.getBlockNumber()
    console.log("Connected to provider")
    return provider
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
  const activeProvider = await getActiveProvider(chain)

  if (!activeProvider) {
    console.error("No provider is available!")
    return null
  }

  const contract = new Contract(contractAddress, abi, activeProvider)
  return contract // Now you can run any queries on this contract instance
}
