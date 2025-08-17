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
  const cellarConfig = cellarDataMap.find(
    (item) => item.config.chain.id === chainId
  )!

  const cellarContract = cellarConfig.cellarContract
  const stakerContract = cellarConfig.stakerContract

  const shares = await publicClient.getBalance({
    address: address as `0x${string}`,
    token: cellarContract.address,
  })

  const stakedShares = await publicClient.getBalance({
    address: address as `0x${string}`,
    token: stakerContract.address,
  })

  const strategyData = await getStrategyData(
    cellarConfig.config.cellar.slug,
    publicClient
  )

  const allStrategiesData = await getAllStrategiesData(publicClient)

  return {
    shares: shares.value,
    stakedShares: stakedShares.value,
    strategyData,
    allStrategiesData,
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
    const cellarContract = contracts.cellarContract
    const stakerContract = contracts.stakerContract

    if (!cellarContract) {
      console.warn("Cellar contract not found")
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

    // Get shares from cellar contract
    let shares = 0n
    try {
      shares = await cellarContract.read.balanceOf([
        userAddress as `0x${string}`,
      ])
    } catch (error) {
      console.error("Error reading cellar balance:", error)
      shares = 0n
    }

    // Get staked shares from staker contract (if it exists)
    let stakedShares = 0n
    if (stakerContract) {
      try {
        stakedShares = await stakerContract.read.balanceOf([
          userAddress as `0x${string}`,
        ])
      } catch (error) {
        console.error("Error reading staker balance:", error)
        stakedShares = 0n
      }
    }

    const sharesFormatted = formatUnits(shares, 18)
    const stakedSharesFormatted = formatUnits(stakedShares, 18)
    const totalShares = shares + stakedShares

    const netValue =
      Number(formatUnits(totalShares, 18)) *
      parseFloat(strategyData.tokenPrice || "0") *
      parseFloat(baseAssetPrice || "0")

    return {
      userStrategyData: {
        userData: {
          netValue: {
            formatted: formatUSD(netValue.toString(), 2),
            value: netValue,
          },
          shares: {
            formatted: sharesFormatted,
            value: shares,
          },
          stakedShares: {
            formatted: stakedSharesFormatted,
            value: stakedShares,
          },
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
