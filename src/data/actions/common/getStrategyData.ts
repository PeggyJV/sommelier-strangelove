import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"
import {
  estimatedApyValue,
  isAPYEnabled,
  isEstimatedApyEnable,
} from "data/uiConfig"
import { add, isBefore, isFuture, subDays } from "date-fns"
import { GetStrategyDataQuery } from "data/actions/types"
import { CellarStakingV0815 } from "src/abi/types"
import { isComingSoon } from "utils/isComingSoon"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { StrategyContracts } from "../types"
import { getChanges } from "./getChanges"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { getTvm } from "./getTvm"
import { getTokenPrice } from "./getTokenPrice"
import { getApyInception } from "./getApyInception"

export const getStrategyData = async ({
  address,
  contracts,
  sommPrice,
  stratData,
  baseAssetPrice,
}: {
  address: string
  contracts: StrategyContracts
  sommPrice: string
  stratData?: GetStrategyDataQuery["cellar"]
  baseAssetPrice: string
}) => {
  const data = await (async () => {
    try {
      const strategy = Object.values(cellarDataMap).find(
        ({ config }) =>
          config.cellar.address.toLowerCase() ===
          address.toLowerCase()
      )!
      const config: ConfigProps = strategy.config!
      const decimals = config.baseAsset.decimals
      const symbol = config.baseAsset.symbol

      const { stakerContract } = contracts
      const strategyData = stratData
      const dayDatas = strategyData?.dayDatas
      const deprecated = strategy.deprecated
      const slug = strategy.slug
      const name = strategy.name
      const description = strategy.description
      const logo = config.baseAsset.src
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
        const tokenInfo = getTokenByAddress(config.baseAsset.address)
        return { ...tokenInfo, ...config.baseAsset }
      })()

      let tvm = hideValue
        ? undefined
        : getTvm(String(Number(strategyData?.tvlTotal)))

      const tradedAssets = (() => {
        const assets = strategy.tradedAssets
        if (!assets) return
        const tokens = assets.map((v) => {
          const token = getTokenBySymbol(v)
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
          cellarConfig: config,
        })
        return apyRes
      })()

      const baseApy = (() => {
        if (hideValue) return
        if (!isAPYEnabled(config)) return

        const launchDay = launchDate ?? subDays(new Date(), 8)
        const launchEpoch = Math.floor(launchDay.getTime() / 1000)

        return getApyInception({
          launchEpoch: launchEpoch,
          baseApy: config.baseApy,
          shareData: dayDatas ? dayDatas[0] : undefined,
          decimals: decimals,
          startingShareValue: strategy.startingShareValue,
        })
      })()

      //! NOTE: This only applies to token prices
      const changes =
        (!hideValue && dayDatas && getChanges(dayDatas)) || undefined

      const tokenPrice = (() => {
        if (hideValue) return
        if (!strategyData?.shareValue) return

        let price = parseFloat(
          (
            (Number(strategyData.shareValue) /
              10 ** config.cellar.decimals) *
            Number(baseAssetPrice)
          ).toFixed(2)
        )
        return `$${price}`
      })()

      const token = (() => {
        if (hideValue) return
        if (!strategyData) return
        return getTokenPrice(
          strategyData.shareValue,
          config.cellar.decimals 
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
        config,
      }
    } catch (e) {
      console.error(address, e)
    }
  })()

  return data
}
