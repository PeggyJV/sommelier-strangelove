import { cellarDataMap } from "data/cellarDataMap"
import { CellarStakingV0815 } from "src/abi/types"
import { StrategyContracts } from "../types"

import {
  isAPYEnabled,
  isAssetDistributionEnabled,
} from "data/uiConfig"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { add, isBefore, isFuture, subDays } from "date-fns"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { CellarKey, ConfigProps } from "data/types"
import { getBaseApy as getV2BaseApy } from "../CELLAR_V2/getBaseApy"
import { getBaseApy } from "./getBaseApy"
import { getChanges } from "./getChanges"
import { getTvm } from "./getTvm"
import { formatDecimals } from "utils/bigNumber"
import { GetStrategyDataQuery } from "generated/subgraph"
import { getPositon } from "./getPosition"

export const getStrategyData = async ({
  address,
  contracts,
  sommPrice,
  sgData,
}: {
  address: string
  contracts: StrategyContracts
  sommPrice: string
  sgData: GetStrategyDataQuery["cellar"]
}) => {
  const data = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!

    const { stakerContract } = contracts
    const subgraphData = sgData

    const dayDatas = subgraphData?.dayDatas

    const slug = strategy.slug
    const name = strategy.name
    const description = strategy.description
    const logo = config.lpToken.imagePath
    const protocols = strategy.protocols
    const type = strategy.cellarType
    const provider = strategy.strategyProvider
    const launchDate = strategy.launchDate
    const isNew =
      !!launchDate &&
      isBefore(launchDate, add(new Date(), { weeks: 2 }))

    const activeAsset = (() => {
      if (!subgraphData?.asset?.id) return
      const tokenInfo = getTokenByAddress(subgraphData.asset.id)
      return { ...tokenInfo, ...subgraphData.asset }
    })()

    const tvm = getTvm(subgraphData?.tvlTotal)

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

    const positionDistribution = (() => {
      return getPositon(
        subgraphData?.positions,
        subgraphData?.positionDistribution
      )
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

    const baseApy = (() => {
      if (!isAPYEnabled(config)) return

      const datas = dayDatas?.slice(0, 10)

      if (config.cellar.key === CellarKey.CELLAR_V2) {
        const launchDay = launchDate ?? subDays(new Date(), 8)
        const launchEpoch = Math.floor(launchDay.getTime() / 1000)
        return getV2BaseApy({
          launchEpoch: launchEpoch,
          baseApy: config.baseApy,
          dayDatas: datas,
        })
      }

      return getBaseApy({
        baseApy: config.baseApy,
        dayDatas: datas,
      })
    })()

    const changes = getChanges(dayDatas)

    const tokenPrice = (() => {
      if (!subgraphData?.shareValue) return

      const price = formatDecimals(subgraphData.shareValue, 6, 2)
      return `$${price}`
    })()

    return {
      activeAsset,
      address,
      baseApy,
      changes,
      description,
      isNew,
      isStakingOngoing,
      launchDate,
      logo,
      name,
      positionDistribution,
      protocols,
      provider,
      rewardsApy,
      slug,
      stakingEnd,
      tokenPrice,
      tradedAssets,
      tvm,
      type,
    }
  })()
  return data
}
