import { AllContracts, AllStrategiesData } from "../types"
import { formatUSD, toEther } from "utils/formatCurrency"
import { reactQueryClient } from "utils/reactQuery"
import { getUserDataWithContracts } from "./getUserData"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"

export const getUserDataAllStrategies = async ({
  allContracts,
  strategiesData,
  userAddress,
  sommPrice,
  chain,
}: {
  allContracts: AllContracts
  strategiesData: AllStrategiesData
  userAddress: string
  sommPrice: string
  chain: string
}) => {
  type Data = Awaited<ReturnType<typeof getUserDataWithContracts>>
  const getNetValue = (item: Data | undefined): number => {
    const value = item?.userStrategyData?.userData?.netValue?.value
    return typeof value === "number" ? value : 0
  }
  const getRewardsValue = (item: Data | undefined): bigint => {
    const rewards = (
      item as unknown as {
        userStakes?: { totalClaimAllRewards?: { value?: bigint } }
      }
    )?.userStakes?.totalClaimAllRewards?.value
    return typeof rewards === "bigint" ? rewards : 0n
  }
  const getRewardsUsd = (item: Data | undefined): number => {
    const rewardsUsd = (
      item as unknown as {
        userStakes?: { claimAllRewardsUSD?: number | string }
      }
    )?.userStakes?.claimAllRewardsUSD
    return Number(rewardsUsd ?? 0)
  }
  const fallbackUserData = (
    strategyData: Parameters<typeof getUserDataWithContracts>[0]["strategyData"]
  ): Data => ({
    userStrategyData: {
      userData: {
        netValue: { formatted: "0", value: 0 },
        shares: { formatted: "0", value: 0n },
        stakedShares: { formatted: "0", value: 0n },
      },
      strategyData,
    },
    userStakes: null,
  })

  const userDataRes = await Promise.all(
    Object.entries(allContracts)?.map(async ([key, contracts]) => {
      // Only get data for the current chain
      if (contracts.chain !== chain) {
        return
      }

      // If chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
      const address = key.split("-")[0]

      const strategyData = strategiesData.find(
        (item) =>
          item?.address === address &&
          item.config.chain.id === contracts.chain
      )

      const result = await reactQueryClient.fetchQuery({
        queryKey: [
          "USE_USER_DATA",
          { contractAddress: address, userAddress },
        ],
        queryFn: async () => {
          const strategy = Object.values(cellarDataMap).find(
            ({ config }) =>
              config.cellar.address.toLowerCase() ===
                address.toLowerCase() &&
              config.chain.id === contracts.chain
          )!

          const config: ConfigProps = strategy.config!

          const baseAsset = config.baseAsset
          const baseAssetPrice = await fetchCoingeckoPrice(
            baseAsset,
            "usd"
          )

          try {
            return await getUserDataWithContracts({
              address,
              contracts,
              sommPrice,
              strategyData: strategyData,
              userAddress,
              baseAssetPrice: baseAssetPrice!,
              chain: contracts.chain,
            })
          } catch (error) {
            console.log("error", error)
            // Return a safe fallback to keep the query defined
            return fallbackUserData(strategyData)
          }
        },
      })
      return result
    })
  )

  const userData = userDataRes.filter((item) => !!item)

  const totalNetValue = (() => {
    let total = 0
    userData.forEach((item) => {
      total += getNetValue(item)
    })
    return total
  })()

  const totalSommRewards = userData.reduce((total, item) => {
    return total + getRewardsValue(item)
  }, 0n)

  const totalSommRewardsInUsd = userData.reduce((total, item) => {
    return total + getRewardsUsd(item)
  }, 0)
  const isData = (item: Data | undefined): item is Data => {
    if (!item) return false
    const netValue = item.userStrategyData?.userData?.netValue?.value
    return typeof netValue === "number" && netValue > 0
  }
  const cleanData = userData.filter(isData)

  const data = {
    totalNetValue: {
      value: totalNetValue,
      formatted: formatUSD(String(totalNetValue)),
    },
    totalSommRewards: {
      value: totalSommRewards,
      formatted: Number(
        toEther(totalSommRewards, 6, false, 2)
      ).toLocaleString(),
    },
    totalSommRewardsInUsd,
    strategies: cleanData,
  }

  return data
}
