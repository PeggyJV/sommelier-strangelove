import { getBalance } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { showNetValueInAsset } from "data/uiConfig"
import { formatUSD } from "utils/formatCurrency"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { StrategyContracts, StrategyData } from "../types"
import { formatUnits, getAddress } from "viem"
import { wagmiConfig } from "context/wagmiContext"
import { ZERO } from "utils/bigIntHelpers"

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
  baseAssetPrice,
  chain
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
  baseAssetPrice: string
  chain: string
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address && config.chain.id === chain
    )!
    const config: ConfigProps = strategy.config!
    const symbol = config.baseAsset.symbol

    const shares = await getBalance(wagmiConfig, {
      token: getAddress(
       config.cellar.address
      ),
      address: getAddress(userAddress),
    })

    const userStakes = await(async () => {
      if (
        !contracts.stakerContract ||
        (config.staker?.key !== StakerKey.CELLAR_STAKING_V0815 &&
          config.staker?.key !== StakerKey.CELLAR_STAKING_V0821)
      ) {
        return
      }

      return await getUserStakes(
        userAddress,
        contracts.stakerContract,
        sommPrice,
        config
      )
    })()

    // !!! TODO: We need to rewrite this file and most of the incentive code, pushing this unitl the new staking contracts come out
    // Can do a manual override per strategy if needed here

    const bonded = userStakes?.totalBondedAmount?.value ?? "0"

    const totalShares = shares.value + BigInt(bonded.toString())

    const totalAssets = await getBalanceInAsset(
      contracts,
      totalShares,
      config,
      userAddress
    )

    const numTotalAssets = Number(totalAssets).toFixed(5)

    let sommRewardsUSD = userStakes
      ? Number(userStakes.claimAllRewardsUSD)
      : 0
    let sommRewardsRaw = userStakes
      ? symbol !== "USDC"
        ? Number(userStakes.claimAllRewardsUSD) /
          parseFloat(baseAssetPrice)
        : Number(userStakes.claimAllRewardsUSD)
      : 0

    const netValueInAsset = (() => {
      return Number(numTotalAssets) + Number(sommRewardsRaw)
    })()

    const netValueWithoutRewardsInAsset = (() => {
      return Number(totalAssets)
    })()

    // Denoted in USD
    const netValue = (() => {
      return Number(totalAssets) * Number(baseAssetPrice) + sommRewardsUSD
    })()

    // Denoted in USD
    const netValueWithoutRewards = (() => {
      return Number(totalAssets) * Number(baseAssetPrice)
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
            ? `${Number(netValueInAsset).toFixed(
                showNetValueInAsset(config) ? 6 : 2
              )} ${config.baseAsset.symbol}`
            : "--",
        },
        netValueWithoutRewardsInAsset: {
          value: netValueWithoutRewardsInAsset,
          formatted: netValueWithoutRewardsInAsset
            ? `${netValueWithoutRewardsInAsset.toFixed(
                showNetValueInAsset(config) ? 6 : 2
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

const getBalanceInAsset = async (
  contracts: any,
  totalShares: bigint,
  config: ConfigProps,
  userAddress: string
) => {
  let contract = config.boringVault 
    ? contracts.boringVaultLens 
    : contracts.cellarContract

  if (!contract) {
    return ZERO
  }
  let assets = ZERO;
  try {
    assets = config.boringVault
    ? await contract.read.balanceOfInAssets([
        userAddress,
        config.cellar.address,
        config.accountant?.address,
      ])
    : await contract.read.convertToAssets([totalShares])
  } catch (error) {
    return ZERO
  }

  if (typeof assets === "undefined") {
    assets = BigInt(0)
  }
  return formatUnits(assets, config.baseAsset.decimals)
}
