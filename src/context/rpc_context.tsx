// src/context/rpc_context.tsx
import { Contract, providers } from "ethers"
import { Chain } from "src/data/chainConfig"

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY

export async function getActiveProvider(chain: Chain) {
  const ALCHEMY_PROVIDER = new providers.JsonRpcProvider(
    `${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
  )
  const INFURA_PROVIDER = new providers.JsonRpcProvider(
    `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
  )

  // Try connecting to Alchemy first
  try {
    await ALCHEMY_PROVIDER.getBlockNumber()
    console.log("Connected to Alchemy")
    return ALCHEMY_PROVIDER
  } catch (error) {
    console.warn("Failed to connect to Alchemy. Trying Infura...")
  }

  // If Alchemy fails, try connecting to Infura
  try {
    await INFURA_PROVIDER.getBlockNumber()
    console.log("Connected to Infura")
    return INFURA_PROVIDER
  } catch (error) {
    console.error("Failed to connect to both Alchemy and Infura!")
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
