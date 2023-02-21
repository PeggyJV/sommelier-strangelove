import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { AllContracts, AllStrategiesData } from "../types"
import { getUserShareBalance } from "./getUserShareBalance"
import {
  CellarStakingV0815,
  CellarV0815,
  CellarV0816,
} from "src/abi/types"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { formatUSD, toEther } from "utils/formatCurrency"

export const getUserData = async ({
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
        const strategy = Object.values(cellarDataMap).find(
          ({ config }) => config.cellar.address === address
        )!
        const config: ConfigProps = strategy.config!

        const strategyData = strategiesData.find(
          (item) => item.address === address
        )

        const shares = await getUserShareBalance({
          cellarContract: contracts.cellarContract as
            | CellarV0815
            | CellarV0816,
          activeAsset: strategyData?.activeAsset,
          address: userAddress,
        })

        const userStakes = await (async () => {
          if (
            !contracts.stakerContract ||
            !contracts.stakerSigner ||
            config.staker?.key !== StakerKey.CELLAR_STAKING_V0815
          ) {
            return
          }

          return await getUserStakes(
            userAddress,
            contracts.stakerContract as CellarStakingV0815,
            contracts.stakerSigner as CellarStakingV0815,
            sommPrice
          )
        })()

        const netValue =
          shares.value.toNumber() +
          (userStakes
            ? userStakes.claimAllRewardsUSD.toNumber()
            : 0) +
          (userStakes
            ? Number(userStakes.totalBondedAmount.formatted)
            : 0)

        const userStrategyData = {
          strategyData,
          userData: {
            netValue: {
              value: netValue,
              formatted: formatUSD(String(netValue)),
            },
            claimableSommReward:
              userStakes?.totalClaimAllRewards || undefined,
          },
        }
        if (netValue <= 0) return
        return {
          userStakes,
          netValue,
          userStrategyData,
        }
      }
    )
  )

  const userData = userDataRes.filter((item) => item !== undefined)

  const totalNetValue = userData.reduce((total, item) => {
    return total + (item ? item.netValue : 0)
  }, 0)

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

  const data = {
    totalNetValue: {
      value: totalNetValue,
      formatted: formatUSD(String(totalNetValue)),
    },
    totalSommRewards: {
      value: totalSommRewards,
      formatted: toEther(totalSommRewards, 6, false, 2),
    },
    strategies: userData.map((item) => item!.userStrategyData),
  }

  return data
}
