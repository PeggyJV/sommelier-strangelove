import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"
import {
  estimatedApyValue,
  isAPYEnabled,
  isAssetDistributionEnabled,
  isEstimatedApyEnable,
} from "data/uiConfig"
import { add, isBefore, isFuture, subDays } from "date-fns"
import { GetStrategyDataQuery } from "generated/subgraph"
import { CellarStakingV0815, CellarV0816 } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { isComingSoon } from "utils/isComingSoon"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { getActiveAsset } from "../DEPRECATED/common/getActiveAsset"
import { StrategyContracts } from "../types"
import { getChanges } from "./getChanges"
import { getPositon } from "./getPosition"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { getTvm } from "./getTvm"
import { getTokenPrice } from "./getTokenPrice"
import { getApyInception } from "./getApyInception"

export const getStrategyData = async ({
  address,
  contracts,
  sommPrice,
  sgData,
  decimals,
  baseAssetPrice,
  symbol,
}: {
  address: string
  contracts: StrategyContracts
  sommPrice: string
  sgData?: GetStrategyDataQuery["cellar"]
  decimals: number
  baseAssetPrice: string
  symbol: string
}) => {
  const data = await (async () => {
    try {
      const strategy = Object.values(cellarDataMap).find(
        ({ config }) =>
          config.cellar.address.toLowerCase() ===
          address.toLowerCase()
      )!
      const config: ConfigProps = strategy.config!

      const { stakerContract, cellarContract } = contracts
      const subgraphData = sgData
      const dayDatas = subgraphData?.dayDatas
      const deprecated = strategy.deprecated
      const slug = strategy.slug
      const name = strategy.name
      const description = strategy.description
      const logo = config.lpToken.imagePath
      const protocols = strategy.protocols
      const type = strategy.cellarType
      const provider = strategy.strategyProvider
      const launchDate = strategy.launchDate
      const stakingLaunchDate = strategy.stakingLaunchDate
      const isNew =
        !!launchDate &&
        isBefore(launchDate, add(new Date(), { weeks: 4 }))
      const isContractNotReady = strategy.isContractNotReady

      const hideValue =
        isComingSoon(launchDate) &&
        process.env.NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE === "false"

      const activeAsset = await (async () => {
        if (!subgraphData?.asset?.id) {
          try {
            const aAsset = await getActiveAsset(
              cellarContract as CellarV0816
            )
            if (!aAsset) return
            const tokenInfo = getTokenByAddress(aAsset.address)
            return { ...tokenInfo, ...aAsset }
          } catch (e) {
            console.log(e)
            return undefined
          }
        }
        const tokenInfo = getTokenByAddress(subgraphData.asset.id)
        return { ...tokenInfo, ...subgraphData.asset }
      })()

      let tvm = hideValue
        ? undefined
        : symbol !== "USDC"
        ? getTvm(
            String(
              Number(subgraphData?.tvlTotal) * Number(baseAssetPrice)
            )
          )
        : getTvm(subgraphData!.tvlTotal)

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
        if (!subgraphData) return
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
        if (hideValue) return
        if (!isStakingOngoing) return

        let assetPrice = "1"
        if (symbol !== "USDC") {
          assetPrice = baseAssetPrice!
        }

        const apyRes = await getRewardsApy({
          sommPrice,
          assetPrice,
          stakerContract: stakerContract as CellarStakingV0815,
        })
        return apyRes
      })()

      const baseApy = (() => {
        if (hideValue) return
        if (!isAPYEnabled(config)) return
        const datas = dayDatas?.slice(0, 10)

        const launchDay = launchDate ?? subDays(new Date(), 8)
        const launchEpoch = Math.floor(launchDay.getTime() / 1000)

        return getApyInception({
          launchEpoch: launchEpoch,
          baseApy: config.baseApy,
          dayDatas: datas,
          decimals: decimals,
          startingShareValue: strategy.startingShareValue,
        })
      })()

      const changes =
        (!hideValue && dayDatas && getChanges(dayDatas)) || undefined

      const tokenPrice = (() => {
        if (hideValue) return
        if (!subgraphData?.shareValue) return

        const price = formatDecimals(
          (
            parseFloat(subgraphData.shareValue) *
            parseFloat(baseAssetPrice)
          ).toString(),
          decimals,
          2
        )
        return `$${price}`
      })()

      const token = (() => {
        if (hideValue) return
        if (!subgraphData) return
        return getTokenPrice(
          subgraphData.shareValue,
          subgraphData.asset.decimals
        )
      })()

      const baseApyValue = isEstimatedApyEnable(config)
        ? estimatedApyValue(config)
        : baseApy

      const baseApySumRewards = {
        formatted:
          (
            (baseApyValue?.value ?? 0) + (rewardsApy?.value ?? 0)
          ).toFixed(2) + "%",
        value: (baseApyValue?.value ?? 0) + (rewardsApy?.value ?? 0),
      }

      return {
        activeAsset,
        address,
        baseApy: baseApyValue,
        baseApySumRewards,
        changes,
        description,
        isNew,
        isStakingOngoing,
        isContractNotReady,
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
        stakingLaunchDate,
        deprecated,
        token,
      }
    } catch (e) {
      console.error(address, e)
    }
  })()

  return data
}
