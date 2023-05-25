import { AllContracts, AllStrategiesData } from "../types"
import { formatUSD, toEther } from "utils/formatCurrency"
import { reactQueryClient } from "utils/reactQuery"
import { getUserData } from "./getUserData"
import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { tokenConfig } from "data/tokenConfig"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"

export const getUserDataAllStrategies = async ({
  allContracts,
  strategiesData,
  userAddress,
  sommPrice,
  sgData,
}: {
  allContracts: AllContracts
  strategiesData: AllStrategiesData
  userAddress: string
  sommPrice: string
  sgData?: GetAllStrategiesDataQuery
}) => {
  if (!sgData) return undefined
  const userDataRes = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const strategyData = strategiesData.find(
          (item) => item?.address === address
        )
        if (!strategyData) return
        const result = await reactQueryClient.fetchQuery(
          [
            "USE_USER_DATA",
            { signer: true, contractAddress: address, userAddress },
          ],
          async () => {
            const subgraphData = sgData.cellars.find(
              (v) => v.id === address
            )!
            const baseAsset = tokenConfig.find(
              (token) => token.symbol === subgraphData.asset.symbol
            )
            const baseAssetPrice = await fetchCoingeckoPrice(
              baseAsset?.coinGeckoId ?? "usd-coin",
              "usd"
            )
            return await getUserData({
              address,
              contracts,
              sommPrice,
              strategyData: strategyData,
              userAddress,
              sgData: subgraphData,
              decimals: subgraphData.asset.decimals ?? 6,
              baseAssetPrice: baseAssetPrice!,
              symbol: subgraphData.asset.symbol ?? "USDC",
            })
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
