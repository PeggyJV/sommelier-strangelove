import { formatUnits } from "viem"
import { useAccount, usePublicClient } from "wagmi"
import { cellarDataMap } from "data/cellarDataMap"
import { getStrategyData } from "./getStrategyData"
import { getAllStrategiesData } from "./getAllStrategiesData"
import { useQuery } from "@tanstack/react-query"

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
