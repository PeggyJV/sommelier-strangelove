import { fetchBalance } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { showNetValueInAsset } from "data/uiConfig"
import { GetStrategyDataQuery } from "generated/subgraph"
import { CellarStakingV0815 } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { formatUSD } from "utils/formatCurrency"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { StrategyContracts, StrategyData } from "../types"

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
  sgData,
  baseAssetPrice,
  decimals,
  symbol,
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
  sgData?: GetStrategyDataQuery["cellar"]
  decimals: number
  baseAssetPrice: string
  symbol: string
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!
    const subgraphData = sgData

    const tokenPrice = (() => {
      if (!subgraphData?.shareValue) return 1

      const price = formatDecimals(subgraphData.shareValue, decimals)

      return symbol !== "USDC"
        ? Number(price) * Number(baseAssetPrice)
        : Number(price)
    })()

    const shares = await fetchBalance({
      token: config.cellar.address,
      addressOrName: userAddress,
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

    const bonded = userStakes
      ? Number(userStakes.totalBondedAmount.formatted)
      : 0

    const sommRewardsUSD = userStakes
      ? userStakes.claimAllRewardsUSD.toNumber()
      : 0
    const sommRewardsRaw = userStakes
      ? symbol !== "USDC"
        ? userStakes.claimAllRewardsUSD.toNumber() /
          parseFloat(baseAssetPrice)
        : userStakes.claimAllRewardsUSD.toNumber()
      : 0

    const userShares =
      (shares && Number(Number(shares.formatted).toFixed(5))) || 0

    const netValueInAsset = (() => {
      if (
        Boolean(subgraphData?.shareValue)
          ? shares === undefined ||
            userStakes === undefined ||
            bonded === undefined ||
            !subgraphData?.shareValue
          : false
      ) {
        return undefined
      }
      return userShares + bonded + Number(sommRewardsRaw)
    })()

    const netValueWithoutRewardsInAsset = (() => {
      if (
        Boolean(subgraphData?.shareValue)
          ? shares === undefined ||
            userStakes === undefined ||
            bonded === undefined ||
            !subgraphData?.shareValue
          : false
      ) {
        return undefined
      }
      return (userShares + bonded) * tokenPrice
    })()

    const netValue = (() => {
      if (
        Boolean(subgraphData?.shareValue)
          ? shares === undefined ||
            userStakes === undefined ||
            bonded === undefined ||
            !subgraphData?.shareValue
          : false
      ) {
        return undefined
      }
      return (userShares + bonded) * tokenPrice + sommRewardsUSD
    })()

    const netValueWithoutRewards = (() => {
      if (
        Boolean(subgraphData?.shareValue)
          ? shares === undefined ||
            userStakes === undefined ||
            bonded === undefined ||
            !subgraphData?.shareValue
          : false
      ) {
        return undefined
      }
      return (userShares + bonded) * tokenPrice
    })()

    const userStrategyData = {
      strategyData,
      userData: {
        netValue: {
          value: netValue,
          formatted: formatUSD(String(netValue)),
        },
        netValueInAsset: {
          value: netValueInAsset,
          formatted: netValueInAsset
            ? `${netValueInAsset.toFixed(
                showNetValueInAsset(config) ? 5 : 2
              )} ${subgraphData?.asset.symbol}`
            : "--",
        },
        netValueWithoutRewardsInAsset: {
          value: netValueWithoutRewardsInAsset,
          formatted: netValueWithoutRewardsInAsset
            ? `${netValueWithoutRewardsInAsset.toFixed(
                showNetValueInAsset(config) ? 5 : 2
              )} ${subgraphData?.asset.symbol}`
            : "--",
        },
        valueWithoutRewards: {
          value: netValueWithoutRewards,
          formatted: formatUSD(String(netValueWithoutRewards)),
        },
        claimableSommReward:
          userStakes?.totalClaimAllRewards || undefined,
        userStakes,
        symbol: subgraphData?.asset.symbol,
      },
    }

    return {
      userStakes,
      netValue,
      userStrategyData,
    }
  })()

  return userDataRes
}
