import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"
import {
  estimatedApyValue,
  isAPYEnabled,
  isEstimatedApyEnable,
} from "data/uiConfig"
import { add, isBefore, isFuture, subDays } from "date-fns"
import { GetStrategyDataQuery } from "data/actions/types"
import { isComingSoon } from "utils/isComingSoon"
import { getStakingEnd } from "../CELLAR_STAKING_V0815/getStakingEnd"
import { getRewardsApy } from "./getRewardsApy"
import { StrategyContracts } from "../types"
import { getChanges } from "./getChanges"
import { getTokenByAddress, getTokenBySymbol } from "./getToken"
import { getTvm } from "./getTvm"
import { getTokenPrice } from "./getTokenPrice"
import { createApyChangeDatum } from "src/utils/chartHelper"
import { config as utilConfig } from "src/utils/config"

// Normalize helper for robust matching
const norm = (s?: string) =>
  (s ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .trim()

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
  const contractChain =
    (contracts as { chain?: string }).chain ?? ""
  const data = await (async () => {
    try {
      const strategy = Object.values(cellarDataMap).find(
        ({ config }) =>
          config.cellar.address.toLowerCase() ===
            address.toLowerCase() &&
          config.chain.id === contractChain
      )
      if (!strategy) {
        throw new Error(
          `Strategy not found for address ${address} on chain ${
            contractChain
          }`
        )
      }
      const config: ConfigProps = strategy.config!
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

      const isHero = strategy.isHero

      const hideValue =
        isComingSoon(launchDate) &&
        process.env.NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE === "false"

      const activeAsset = await (async () => {
        const tokenInfo = getTokenByAddress(
          config.baseAsset.address,
          config.chain.id
        )
        return { ...tokenInfo, ...config.baseAsset }
      })()

      let tvm = hideValue
        ? undefined
        : getTvm(String(Number(strategyData?.tvlTotal ?? 0)))

      const tradedAssets = (() => {
        const assets = strategy.tradedAssets
        if (!assets) return
        const tokens = assets.map((v) => {
          const token = getTokenBySymbol(v, config.chain.id)
          return token
        })

        return tokens
      })()
      const depositTokens = strategy.depositTokens.list
      const stakingEnd = await getStakingEnd(stakerContract)
      const isStakingOngoing =
        stakingEnd?.endDate && isFuture(stakingEnd?.endDate)

      // ! Rewards APY override only goes here if rewards are happening instead of somm rewards
      // TODO: This is tech debt, we need to migrate to lists of APYs for each rewards token
      const rewardsApy = await (async () => {
        if (hideValue) return

        // Custom reward APY overrides
        // TODO: Eventually we just need to make this a type of list with the specific token reward and the APY
        /**
        if (strategy.slug === utilConfig.CONTRACT.TURBO_STETH.SLUG) {
          // Get wstETH price
          const wstethPrice = Number(
            await fetchCoingeckoPrice("wrapped-steth", "usd")
          )

          // Get TVL
          let usdTvl = Number(strategyData?.tvlTotal)

          // 20 wsteth per month * 12 months * 100 for human readable %
          let apy = ((20 * wstethPrice) / usdTvl) * 12 * 100

          return {
            formatted: apy.toFixed(2).toString() + "%",
            value: apy,
          }
        }
        **/

        if (!isStakingOngoing) return

        let assetPrice = "1"
        if (symbol !== "USDC") {
          assetPrice = baseAssetPrice!
        }

        const apyRes = await getRewardsApy({
          sommPrice,
          assetPrice,
          stakerContract: stakerContract,
          cellarConfig: config,
        })
        return apyRes
      })()

      let merkleRewardsApy

      // if (strategy.slug === utilConfig.CONTRACT.REAL_YIELD_ETH_OPT.SLUG) {
      //   merkleRewardsApy = await getMerkleRewardsApy(cellarContract, config);
      // }

      let extraRewardsApy = undefined
      // TODO: This is part of the tech debt above, this is extra rewards APYs if they should be in addition to SOMM rewards
      /**
      if (strategy.slug === utilConfig.CONTRACT.TURBO_GHO.SLUG) {
        // Get GHO price
        const ghoPrice = Number(
          await fetchCoingeckoPrice("gho", "usd")
        )

        // Get TVL
        let usdTvl = Number(strategyData?.tvlTotal)

        // 5400 GHO per week * 52 weeks * 100 for human readable %
        // TODO: Update this  + expiration date in config weekly as long as GHO incentives live
        let apy = ((4150 * ghoPrice) / usdTvl) * 52 * 100

        extraRewardsApy = {
          formatted: apy.toFixed(2).toString() + "%",
          value: apy,
          tokenSymbol: "GHO",
          tokenIcon: GHOIcon,
        }
      }
      */
      // /*
      // if (strategy.slug === utilConfig.CONTRACT.TURBO_EETH.SLUG) {
      //   // Get TVL
      //   let usdTvl = Number(strategyData?.tvlTotal)

      //   // $2.7k worth of eETH per month * 12 months * 100 for human readable %
      //   // TODO: Update this  + expiration date in config weekly as long as eETH incentives live
      //   let apy = (2700 / usdTvl) * 12 * 100

      //   extraRewardsApy = {
      //     formatted: apy.toFixed(2).toString() + "%",
      //     value: apy,
      //     tokenSymbol: "weETH",
      //     tokenIcon: EETHIcon,
      //   }
      // }
      // */

      // if (strategy.slug === utilConfig.CONTRACT.TURBO_ETHX.SLUG) {
      //   // Get TVL
      //   let usdTvl = Number(strategyData?.tvlTotal)

      //   // $3.5k worth of ETHx per month * 12 months * 100 for human readable %
      //   // TODO: Update this  + expiration date in config weekly as long as ETHx incentives live
      //   let apy = (3500 / usdTvl) * 12 * 100

      //   extraRewardsApy = {
      //     formatted: apy.toFixed(2).toString() + "%",
      //     value: apy,
      //     tokenSymbol: "ETHx",
      //     // tokenIcon: EETHIcon,
      //     tokenIcon: ETHXIcon,
      //   }
      // }

      const baseApy = await (async () => {
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
            let nowValue = BigInt(dayDatas![i].shareValue)
            let startValue = BigInt(dayDatas![i + 1].shareValue)

            let yieldGain =
              Number(nowValue - startValue) / Number(startValue)

            // Take the gains since inception and annualize it to get APY since inception
            let dailyApy = yieldGain * 365 * 100

            movingAvg7D += dailyApy
          }
          movingAvg7D = movingAvg7D / 7

          return {
            formatted: movingAvg7D.toFixed(2) + "%",
            value: Number(movingAvg7D).toFixed(2),
          }
        }

        /**
        if (strategy.slug === utilConfig.CONTRACT.TURBO_STETH.SLUG) {
          const launchDay = launchDate ?? subDays(new Date(), 8)
          const launchEpoch = Math.floor(launchDay.getTime() / 1000)

          let baseAPY = getApyInception({
            launchEpoch: launchEpoch,
            baseApy: config.baseApy,
            shareData: dayDatas ? dayDatas[0] : undefined,
            decimals: decimals,
            startingShareValue: strategy.startingShareValue,
          })

          // Remove wstETH rewards bc they are already accounted for in the base APY
          baseAPY!.value = baseAPY!.value! - rewardsApy?.value!
          baseAPY!.formatted = baseAPY!.value!.toFixed(2) + "%"

          return baseAPY
        }
        **/

        // Custom APY calculation for Alpha stETH vault
        if (strategy.slug === utilConfig.CONTRACT.ALPHA_STETH.SLUG) {
          try {
            // Determine if we are within the first 3 months after launch
            const inFirst3Months =
              !!launchDate && isBefore(new Date(), add(launchDate, { months: 3 }))

            // Helper: compute 24h APR from the two most recent dayDatas entries
            const get24hAPR = (): number | undefined => {
              if (!dayDatas || dayDatas.length < 2) return undefined
              try {
                const nowValue = BigInt(dayDatas[0].shareValue)
                const prevValue = BigInt(dayDatas[1].shareValue)
                if (prevValue === BigInt(0)) return undefined
                const gain = Number(nowValue - prevValue) / Number(prevValue)
                const apr = gain * 365 * 100
                return Number.isFinite(apr) ? apr : undefined
              } catch {
                return undefined
              }
            }

            // Helper: compute incentive APR from BoringVault lens + monthly incentive assumption
            const getIncentiveAPR = async (): Promise<number | undefined> => {
              if (!(contracts.boringVaultLens && config.accountant)) return undefined
              const total_monthly_stETH = 57.5 // Manual input; adjust as needed
              try {
                const lens = contracts.boringVaultLens as unknown as {
                  read: {
                    totalAssets: (
                      args: [`0x${string}`, `0x${string}`]
                    ) => Promise<readonly [unknown, bigint]>
                  }
                }
                const [, totalAssets] = await (
                  lens
                ).read.totalAssets([
                  config.cellar.address as `0x${string}`,
                  config.accountant.address as `0x${string}`,
                ])
                const totalAssetsInStETH = Number(totalAssets) / 1e18
                if (totalAssetsInStETH <= 0) return undefined
                const incentiveAPR = ((total_monthly_stETH / 30) / totalAssetsInStETH) * 365 * 100
                return Number.isFinite(incentiveAPR) ? incentiveAPR : undefined
              } catch (err) {
                console.error("Alpha stETH incentive APR error:", err)
                return undefined
              }
            }

            if (inFirst3Months) {
              const [incentiveAPR, dailyAPR] = await Promise.all([
                getIncentiveAPR(),
                Promise.resolve(get24hAPR()),
              ])
              const selected = Math.max(
                incentiveAPR ?? Number.NEGATIVE_INFINITY,
                dailyAPR ?? Number.NEGATIVE_INFINITY
              )
              const value = Number.isFinite(selected) ? selected : (config.baseApy ?? 0)
              return {
                formatted: value.toFixed(2) + "%",
                value,
              }
            } else {
              // Use 7-day trailing average APR after the first 3 months
              let value: number
              if (dayDatas && dayDatas.length >= 8) {
                let movingAvg7D = 0
                for (let i = 0; i < 7; i++) {
                  const nowValue = BigInt(dayDatas[i].shareValue)
                  const startValue = BigInt(dayDatas[i + 1].shareValue)
                  const yieldGain = Number(nowValue - startValue) / Number(startValue)
                  const dailyApy = yieldGain * 365 * 100
                  movingAvg7D += dailyApy
                }
                value = movingAvg7D / 7
              } else {
                value = config.baseApy || 0
              }
              return {
                formatted: value.toFixed(2) + "%",
                value,
              }
            }
          } catch (error) {
            console.error("Error calculating Alpha stETH APY:", error)
            // Fall through to default calculation
          }
        }

        if (hideValue) return
        if (!isAPYEnabled(config)) return

        const launchDay = launchDate ?? subDays(new Date(), 8)
        const launchEpoch = Math.floor(launchDay.getTime() / 1000)

        const apys = createApyChangeDatum({
          data: dayDatas,
          launchEpoch,
          decimals: config.cellar.decimals, // Cellar decimals
          smooth: true,
          daysSmoothed: 30,
          daysRendered: 30,
        })

        return {
          formatted: apys
            ? apys[apys!.length - 1].y
            : config.baseApy?.toFixed(2) + "%",
          value: apys ? apys[apys!.length - 1].value : config.baseApy,
        }
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
            Number(baseApyValue?.value ?? 0) +
            Number(rewardsApy?.value ?? 0) +
            (merkleRewardsApy ?? 0)
          ).toFixed(2) + "%",
        value:
          Number(baseApyValue?.value ?? 0) +
          (rewardsApy?.value ?? 0) +
          (merkleRewardsApy ?? 0),
      }

      // Determine Somm-native status (in-house strategies)
      const s = norm(slug || name)
      const providerName = norm(provider?.title)
      const isSommNative =
        providerName.includes("somm") || s.includes("alpha-steth")

      if (
        process.env.NODE_ENV !== "production" &&
        s.includes("alpha-steth")
      ) {
        // eslint-disable-next-line no-console
        console.log("[strategy]", s, { providerName, isSommNative })
      }
      return {
        activeAsset,
        address,
        baseApy: baseApyValue,
        baseApySumRewards,
        changes,
        depositTokens,
        description,
        isNew,
        isHero,
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
        merkleRewardsApy,
        isSommNative,
      }
    } catch (error) {
      console.error(error)
      return null
    }
  })()

  return data
}
