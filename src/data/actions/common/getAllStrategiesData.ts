import { cellarDataMap } from "data/cellarDataMap"
import { CellarStakingV0815 } from "src/abi/types"
import { AllContracts } from "../types"

import {
  isAPYEnabled,
  isAssetDistributionEnabled,
} from "data/uiConfig"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { add, isBefore, isFuture, subDays } from "date-fns"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { CellarKey, ConfigProps } from "data/types"
import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { getBaseApy as getV2BaseApy } from "../CELLAR_V2/getBaseApy"
import { getBaseApy } from "./getBaseApy"
import { getChanges } from "./getChanges"
import { getTvm } from "./getTvm"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
  sgData,
}: {
  allContracts: AllContracts
  sommPrice: string
  sgData: GetAllStrategiesDataQuery
}) => {
  const data = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const strategy = Object.values(cellarDataMap).find(
          ({ config }) => config.cellar.address === address
        )!
        const config: ConfigProps = strategy.config!

        const { stakerContract } = contracts
        const subgraphData = sgData.cellars.find(
          (v) => v.id === address
        )

        const dayDatas = subgraphData?.dayDatas

        const name = strategy.name
        const protocols = strategy.protocols
        const type = strategy.cellarType
        const provider = strategy.strategyProvider
        const launchDate = strategy.launchDate
        const isNew =
          !!launchDate &&
          isBefore(launchDate, add(new Date(), { weeks: 2 }))
        const logo = config.lpToken.imagePath

        const activeAsset = (() => {
          if (!subgraphData?.asset?.id) return
          const tokenInfo = getTokenByAddress(subgraphData.asset.id)
          return { ...tokenInfo, ...subgraphData.asset }
        })()

        const tvm = await getTvm(subgraphData?.tvlTotal)

        const tradedAssets = (() => {
          if (!isAssetDistributionEnabled(config)) {
            const assets = strategy.tradedAssets
            if (!assets) return
            const tokens = assets.map((v) => {
              const token = getTokenBySymbol(v)
              return token
            })

            return tokens
          }

          const positions = subgraphData?.positions
          if (!positions) return
          const tokens = positions?.map((v) => {
            const token = getTokenByAddress(v)
            return token
          })

          return tokens
        })()

        const stakingEnd = await getStakingEnd(
          stakerContract as CellarStakingV0815
        )
        const isStakingOngoing =
          stakingEnd?.endDate && isFuture(stakingEnd?.endDate)

        const rewardsApy = await (async () => {
          if (!isStakingOngoing) return

          const apyRes = await getRewardsApy({
            sommPrice,
            stakerContract: stakerContract as CellarStakingV0815,
          })
          return apyRes
        })()

        const baseApy = await (async () => {
          if (!isAPYEnabled(config)) return

          const datas = dayDatas?.slice(0, 10)

          if (config.cellar.key === CellarKey.CELLAR_V2) {
            const launchDay = launchDate ?? subDays(new Date(), 8)
            const launchEpoch = Math.floor(launchDay.getTime() / 1000)
            return await getV2BaseApy({
              launchEpoch: launchEpoch,
              baseApy: config.baseApy,
              dayDatas: datas,
            })
          }

          return await getBaseApy({
            baseApy: config.baseApy,
            dayDatas: datas,
          })
        })()

        const changes = getChanges(dayDatas)

        return {
          address,
          logo,
          name,
          type,
          provider,
          activeAsset,
          tvm,
          tradedAssets,
          protocols,
          launchDate,
          isNew,
          stakingEnd,
          rewardsApy,
          baseApy,
          changes,
          isStakingOngoing,
        }
      }
    )
  )
  return data
}
