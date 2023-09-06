import { AllContracts, AllStrategiesData } from "../types"
import { formatUSD, toEther } from "utils/formatCurrency"
import { reactQueryClient } from "utils/reactQuery"
import { getUserData } from "./getUserData"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"

export const getUserDataAllStrategies = async ({
  allContracts,
  strategiesData,
  userAddress,
  sommPrice,
}: {
  allContracts: AllContracts
  strategiesData: AllStrategiesData
  userAddress: string
  sommPrice: string
}) => {
  const userDataRes = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const strategyData = strategiesData.find(
          (item) => item?.address === address
        )

        const result = await reactQueryClient.fetchQuery(
          [
            "USE_USER_DATA",
            { signer: true, contractAddress: address, userAddress },
          ],
          async () => {
            const strategy = Object.values(cellarDataMap).find(
              ({ config }) =>
                config.cellar.address.toLowerCase() ===
                address.toLowerCase()
            )!
            const config: ConfigProps = strategy.config!

            const baseAsset = config.baseAsset
            const baseAssetPrice = await fetchCoingeckoPrice(
              baseAsset?.coinGeckoId ?? "usd-coin",
              "usd"
            )

            try {
              return await getUserData({
                address,
                contracts,
                sommPrice,
                strategyData: strategyData,
                userAddress,
                baseAssetPrice: baseAssetPrice!,
              })
            } catch (error) {
              console.log("error", error)
            }
          }
        )
        return result
      }
    )
  )

  const userData = userDataRes.filter((item) => !!item)

  const totalNetValue = (() => {
    let total = 0
    userData.forEach((item) => {
      total += Number(item?.netValue)
    })
    return total
  })()

  const totalSommRewards = userData.reduce((total, item) => {
    return (
      total +
      (item
        ? item.userStakes
          ? item.userStakes.totalClaimAllRewards.value.toNumber()
          : 0
        : 0)
    )
  }, 0)

  const totalSommRewardsInUsd = userData.reduce((total, item) => {
    return (
      total +
      (item
        ? item.userStakes
          ? item.userStakes.claimAllRewardsUSD.toNumber()
          : 0
        : 0)
    )
  }, 0)
  type Data = Awaited<ReturnType<typeof getUserData>>
  const isData = (item: Data | undefined): item is Data => {
    return Number(item?.netValue) > 0
  }
  const cleanData = userData.filter(isData)

  const data = {
    totalNetValue: {
      value: totalNetValue,
      formatted: formatUSD(String(totalNetValue)),
    },
    totalSommRewards: {
      value: totalSommRewards,
      formatted: toEther(totalSommRewards, 6, false, 2),
    },
    totalSommRewardsInUsd,
    strategies: cleanData,
  }

  return data
}
