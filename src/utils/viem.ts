/**
 * Centralized viem imports to optimize bundling and reduce file system operations
 * This helps prevent EMFILE errors by reducing the number of modules loaded
 */

// Core exports from viem
export {
  // Client utilities
  createPublicClient,
  createWalletClient,
  http,
  custom,
  type Client,
  type PublicClient,
  type WalletClient,

  // Contract utilities
  getContract,
  type GetContractReturnType,

  // Address utilities
  getAddress,
  isAddress,
  isAddressEqual,
  getContractAddress,

  // Encoding/Decoding utilities
  encodeFunctionData,
  decodeFunctionData,
  decodeFunctionResult,
  encodeFunctionResult,
  parseAbi,
  parseAbiItem,

  // Unit conversion utilities
  formatUnits,
  parseUnits,
  formatEther,
  parseEther,
  formatGwei,
  parseGwei,

  // Types
  type Address,
  type Hash,
  type Hex,
  type ByteArray,
  type SignableMessage,
  type TransactionReceipt,
  type Transaction,

  // Common ABIs
  erc20Abi,
  erc721Abi,
  erc1155Abi,
} from "viem"

// Chain exports
export {
  mainnet,
  arbitrum,
  optimism,
  base,
  polygon,
} from "viem/chains"

// Common constants
export const maxUint256 = BigInt(2) ** BigInt(256) - BigInt(1)
export const maxUint128 = BigInt(2) ** BigInt(128) - BigInt(1)
export const maxUint64 = BigInt(2) ** BigInt(64) - BigInt(1)
export const maxUint32 = BigInt(2) ** BigInt(32) - BigInt(1)
export const maxUint16 = BigInt(2) ** BigInt(16) - BigInt(1)
export const maxUint8 = BigInt(2) ** BigInt(8) - BigInt(1)

// Import types for helper functions
import type { PublicClient as ViemPublicClient } from "viem"
import { createPublicClient as viemCreatePublicClient } from "viem"

// Helper function to create a public client with optimized settings
export function createOptimizedPublicClient(
  chain: any,
  transport: any
) {
  return viemCreatePublicClient({
    chain,
    transport,
    batch: {
      multicall: true,
    },
    cacheTime: 4_000,
    pollingInterval: 4_000,
  })
}

// Helper function to batch multiple contract reads
export async function batchContractReads(
  client: ViemPublicClient,
  calls: Array<{
    address: `0x${string}`
    abi: any
    functionName: string
    args?: any[]
  }>
) {
  try {
    return await client.multicall({
      contracts: calls,
      allowFailure: false,
    })
  } catch (error) {
    // Fallback to individual calls if multicall fails
    const results = []
    for (const call of calls) {
      try {
        const result = await client.readContract({
          ...call,
          args: call.args || [],
        })
        results.push(result)
      } catch {
        results.push(null)
      }
    }
    return results
  }
}
