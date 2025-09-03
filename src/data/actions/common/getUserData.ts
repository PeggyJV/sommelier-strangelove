import { formatUnits } from "viem"
import { useAccount, usePublicClient } from "wagmi"
import { cellarDataMap } from "data/cellarDataMap"
import { getStrategyData } from "./getStrategyData"
import { getAllStrategiesData } from "./getAllStrategiesData"
import { useQuery } from "@tanstack/react-query"
import { formatUSD } from "utils/formatCurrency"

export const getUserData = async (
  address: string,
  publicClient: any,
  chainId: number
) => {
  try {
    // This legacy function isn't used for critical paths anymore.
    // Return a safe minimal object to prevent runtime errors.
    return {
      shares: 0n,
      stakedShares: 0n,
      strategyData: null,
      allStrategiesData: null,
      netValue: 0,
    } as any
  } catch {
    return {
      shares: 0n,
      stakedShares: 0n,
      strategyData: null,
      allStrategiesData: null,
      netValue: 0,
    } as any
  }
}

export const getUserDataWithContracts = async ({
  contracts,
  address,
  strategyData,
  userAddress,
  sommPrice,
  baseAssetPrice,
  chain,
}: {
  contracts: any
  address: string
  strategyData: any
  userAddress: string
  sommPrice: string
  baseAssetPrice: string
  chain: string
}) => {
  try {
    // For now, return a safe default since the contract approach is problematic
    // The actual user data should come from useUserBalance hook which is already
    // being used in useUserStrategyData
    return {
      userStrategyData: {
        userData: {
          netValue: { formatted: "0", value: 0 },
          shares: { formatted: "0", value: 0n },
          stakedShares: { formatted: "0", value: 0n },
        },
        strategyData,
      },
      userStakes: null,
    }
  } catch (error) {
    console.error("Error in getUserData:", error)
    return {
      userStrategyData: {
        userData: {
          netValue: { formatted: "0", value: 0 },
          shares: { formatted: "0", value: 0n },
          stakedShares: { formatted: "0", value: 0n },
        },
        strategyData,
      },
      userStakes: null,
    }
  }
}

export const useUserData = (address: string, chainId: number) => {
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ["USE_USER_DATA", address, chainId],
    queryFn: async () => {
      return await getUserData(address, publicClient, chainId)
    },
    enabled: Boolean(address && chainId && publicClient),
  })
}
