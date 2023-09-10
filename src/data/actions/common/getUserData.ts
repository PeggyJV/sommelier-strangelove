import { BigNumber, constants } from "ethers"
import { BigNumber as BigNumJS} from "bignumber.js"
import { fetchBalance } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { showNetValueInAsset } from "data/uiConfig"
import { CellarV0815, CellarStakingV0815 } from "src/abi/types"
import {
  convertDecimals,
  formatDecimals,
  ZERO,
} from "utils/bigNumber"
import { formatUSD } from "utils/formatCurrency"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { StrategyContracts, StrategyData } from "../types"
import { getAddress } from "ethers/lib/utils.js"
import { config as cellarConfig } from "utils/config"

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
  baseAssetPrice,
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
  baseAssetPrice: string
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!
    const decimals = config.baseAsset.decimals
    const symbol = config.baseAsset.symbol

    const shares = await fetchBalance({
      token: getAddress(config.cellar.address),
      address: getAddress(userAddress),
    })

    const userStakes = await(async () => {
      if (
        !contracts.stakerContract ||
        !contracts.stakerSigner ||
        (config.staker?.key !== StakerKey.CELLAR_STAKING_V0815 &&
          config.staker?.key !== StakerKey.CELLAR_STAKING_V0821)
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

    // !!! TODO: We need to rewrite this file and most of the incentive code, pushing this unitl the new staking contracts come out
    // Can do a manual override per strategy if needed here

    const bonded =
      // Coerce from bignumber.js to ethers BN
      BigNumber.from(
        userStakes?.totalBondedAmount?.value
          ? userStakes?.totalBondedAmount?.value.toFixed()
          : "0"
      ) ?? constants.Zero
    const totalShares = shares.value.add(bonded)

    const totalAssets = await(async () => {
      if (!contracts.cellarContract) {
        return ZERO
      }

      const cellarContract = contracts.cellarContract as CellarV0815
      let assets = await cellarContract.convertToAssets(totalShares)

      if (typeof assets === "undefined") {
        assets = constants.Zero
      }
      return convertDecimals(assets.toString(), decimals)
    })()

    const numTotalAssets = Number(totalAssets.toNumber().toFixed(5))

    let sommRewardsUSD = userStakes
      ? userStakes.claimAllRewardsUSD.toNumber()
      : 0
    let sommRewardsRaw = userStakes
      ? symbol !== "USDC"
        ? userStakes.claimAllRewardsUSD.toNumber() /
          parseFloat(baseAssetPrice)
        : userStakes.claimAllRewardsUSD.toNumber()
      : 0

    const netValueInAsset = (() => {
      return numTotalAssets + Number(sommRewardsRaw)
    })()

    const netValueWithoutRewardsInAsset = (() => {
      return numTotalAssets
    })()

    // Denoted in USD
    const netValue = (() => {
      return totalAssets
        .multipliedBy(baseAssetPrice)
        .plus(sommRewardsUSD)
    })()

    // Denoted in USD
    const netValueWithoutRewards = (() => {
      return totalAssets.multipliedBy(baseAssetPrice)
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
              )} ${config.baseAsset.symbol}`
            : "--",
        },
        netValueWithoutRewardsInAsset: {
          value: netValueWithoutRewardsInAsset,
          formatted: netValueWithoutRewardsInAsset
            ? `${netValueWithoutRewardsInAsset.toFixed(
                showNetValueInAsset(config) ? 5 : 2
              )} ${config.baseAsset.symbol}`
            : "--",
        },
        valueWithoutRewards: {
          value: netValueWithoutRewards,
          formatted: formatUSD(String(netValueWithoutRewards)),
        },
        claimableSommReward:
          userStakes?.totalClaimAllRewards || undefined,
        userStakes,
        symbol: config.baseAsset.symbol,
        totalShares: {
          value: totalShares,
        },
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
