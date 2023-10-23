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
import BigNumber from "bignumber.js"
import { config as utilConfig } from "src/utils/config"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { GHOIcon } from "components/_icons"
import { Contract } from "ethers"

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

      const { stakerContract, cellarContract } = contracts
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

      // ! Rewards APY override only goes here if rewards are happening instead of somm rewards
      // TODO: This is tech debt, we need to migrate to lists of APYs for each rewards token
      const rewardsApy = await (async () => {
        if (hideValue) return

        // Custom reward APY overrides
        // TODO: Eventually we just need to make this a type of list with the specific token reward and the APY
        if (strategy.slug === utilConfig.CONTRACT.TURBO_STETH.SLUG) {
          // Get wstETH price
          const wstethPrice = Number(await fetchCoingeckoPrice(
            "wrapped-steth",
            "usd"
          ))

          // Get TVL
          let usdTvl = Number(strategyData?.tvlTotal) 
          
          // 20 wsteth per month * 12 months * 100 for human readable %
          let apy = (20 * wstethPrice / usdTvl) * 12 * 100

          return {
            formatted: apy.toFixed(2).toString() + "%",
            value: apy,
          }
        }

        if (!isStakingOngoing) return

        let assetPrice = "1"
        if (symbol !== "USDC") {
          assetPrice = baseAssetPrice!
        }

        const apyRes = await getRewardsApy({
          sommPrice,
          assetPrice,
          stakerContract: stakerContract as CellarStakingV0815,
          cellarContract: cellarContract as Contract,
          cellarConfig: config,
        })
        return apyRes
      })()

      let extraRewardsApy = undefined
      // TODO: This is part of the tech debt above, this is extra rewards APYs if they should be in addition to SOMM rewards
      if (strategy.slug === utilConfig.CONTRACT.TURBO_GHO.SLUG) {
        // Get GHO price
        const ghoPrice = Number(
          await fetchCoingeckoPrice("gho", "usd")
        )

        // Get TVL
        let usdTvl = Number(strategyData?.tvlTotal)

        // 5400 GHO per week * 52 weeks * 100 for human readable %
        // TODO: Update this  + expiration date in config weekly as long as GHO incentives live
        let apy = ((5400 * ghoPrice) / usdTvl) * 52 * 100

        extraRewardsApy = {
          formatted: apy.toFixed(2).toString() + "%",
          value: apy,
          tokenSymbol: "GHO",
          tokenIcon: GHOIcon,
        }
      }

      const baseApy = (() => {
        if (config.show7DayAPYTooltip === true) {
          if (dayDatas === undefined || dayDatas.length < 8) {
            return {
              formatted: "0.00%",
              value: 0,
            }
          }

          let movingAvg7D = 0

          for (let i = 0; i < 7; i++) {
            // Get annualized apy for each shareValue
            let nowValue = new BigNumber(dayDatas![i].shareValue)
            let startValue = new BigNumber(
              dayDatas![i + 1].shareValue
            )

            let yieldGain = nowValue.minus(startValue).div(startValue)

            // Take the gains since inception and annualize it to get APY since inception
            let dailyApy = yieldGain.times(365).times(100).toNumber()

            movingAvg7D += dailyApy
          }
          movingAvg7D = movingAvg7D / 7

          return {
            formatted: movingAvg7D.toFixed(2) + "%",
            value: Number(movingAvg7D.toFixed(2)),
          }
        }

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

      // TODO: Rewards APY should be a list of APYs for each rewards token, this is incurred tech debt
      const baseApySumRewards = {
        formatted:
          (
            (baseApyValue?.value ?? 0) +
            (rewardsApy?.value ?? 0) +
            (extraRewardsApy?.value ?? 0)
          ).toFixed(2) + "%",
        value:
          (baseApyValue?.value ?? 0) +
          (rewardsApy?.value ?? 0) +
          (extraRewardsApy?.value ?? 0),
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
        extraRewardsApy,
      }
    } catch (e) {
      console.error(address, e)
    }
  })()

  return data
}
