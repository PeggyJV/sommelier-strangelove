/**
 * Pilot guardrail: Fetch available ETH-side liquidity for Neutron BTC Vault
 *
 * This query fetches the localBalance from the Neutron BTC Vault contract,
 * which represents the WBTC available on Ethereum for immediate withdrawal fulfillment.
 *
 * Used to HARD BLOCK withdrawal requests that exceed available liquidity.
 */

import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { config } from "utils/config"

const NEUTRON_VAULT_ADDRESS = config.CONTRACT.NEUTRON_BTC_VAULT.ADDRESS as `0x${string}`

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com"),
})

interface NeutronVaultLiquidity {
  localBalance: bigint // Available WBTC in sats on ETH side
  totalSupply: bigint  // Total vault shares
  totalNAV: bigint     // Total NAV in sats
}

/**
 * Fetch available liquidity from Neutron BTC Vault
 * Pilot guardrail: Used to block withdrawals exceeding available liquidity
 */
export async function fetchNeutronVaultLiquidity(): Promise<NeutronVaultLiquidity> {
  const abi = [
    {
      inputs: [],
      name: "localBalance",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalNAV",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const

  const [localBalance, totalSupply, totalNAV] = await Promise.all([
    publicClient.readContract({
      address: NEUTRON_VAULT_ADDRESS,
      abi,
      functionName: "localBalance",
    }),
    publicClient.readContract({
      address: NEUTRON_VAULT_ADDRESS,
      abi,
      functionName: "totalSupply",
    }),
    publicClient.readContract({
      address: NEUTRON_VAULT_ADDRESS,
      abi,
      functionName: "totalNAV",
    }),
  ])

  return {
    localBalance,
    totalSupply,
    totalNAV,
  }
}

/**
 * Calculate max withdrawable shares given current liquidity
 * Pilot guardrail: Returns the maximum shares that can be withdrawn
 *
 * Formula: maxShares = localBalance * totalSupply / totalNAV
 * (inverse of share-to-assets conversion)
 */
export function calculateMaxWithdrawableShares(
  localBalance: bigint,
  totalSupply: bigint,
  totalNAV: bigint
): bigint {
  if (totalNAV === 0n) return 0n
  // maxShares = (localBalance * totalSupply) / totalNAV
  return (localBalance * totalSupply) / totalNAV
}

/**
 * Check if a withdrawal amount (in shares) can be fulfilled
 * Pilot guardrail: HARD BLOCK if insufficient liquidity
 */
export function canFulfillWithdrawal(
  requestedShares: bigint,
  localBalance: bigint,
  totalSupply: bigint,
  totalNAV: bigint
): { canFulfill: boolean; requiredAssets: bigint; availableAssets: bigint } {
  if (totalSupply === 0n) {
    return { canFulfill: false, requiredAssets: 0n, availableAssets: localBalance }
  }

  // Calculate assets needed: requiredAssets = (shares * totalNAV) / totalSupply
  const requiredAssets = (requestedShares * totalNAV) / totalSupply

  return {
    canFulfill: requiredAssets <= localBalance,
    requiredAssets,
    availableAssets: localBalance,
  }
}
