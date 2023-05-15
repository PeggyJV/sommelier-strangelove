import { fetchBalance } from "@wagmi/core"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { ethers } from "ethers"
import { GetStrategyDataQuery } from "generated/subgraph"
import { CellarStakingV0815 } from "src/abi/types"
import { formatDecimals } from "utils/bigNumber"
import { config } from "utils/config"
import { formatUSD, toEther } from "utils/formatCurrency"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { StrategyContracts, StrategyData } from "../types"

const RYETH_ADDRESS = config.CONTRACT.REAL_YIELD_ETH.ADDRESS

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
  wethPrice,
  sgData,
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
  wethPrice: string
  sgData?: GetStrategyDataQuery["cellar"]
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!
    const subgraphData = sgData

    const tokenPrice = (() => {
      if (!subgraphData?.shareValue) return 1

      // FIXME:
      // Use subgraph data to determine number of decimals from the underlying asset
      // cellar.asset.decimals
      let decimals = 6
      if (address === RYETH_ADDRESS) {
        decimals = 18
      }
      const price = formatDecimals(
        subgraphData.shareValue,
        decimals,
        2
      )

      return address === RYETH_ADDRESS
        ? Number(price) * Number(wethPrice)
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
      ? address === RYETH_ADDRESS
        ? userStakes.claimAllRewardsUSD.toNumber() * Number(wethPrice)
        : userStakes.claimAllRewardsUSD.toNumber()
      : 0

    const userShares =
      (shares && Number(Number(shares.formatted).toFixed(2))) || 0

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
      return (
        userShares * tokenPrice + bonded * tokenPrice + sommRewardsUSD
      )
    })()

    const netValueInDecimals = ethers.utils.parseUnits(
      netValueInAsset ? netValueInAsset.toString() : "0",
      subgraphData?.asset.decimals
    )

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
            ? `${toEther(
                netValueInDecimals.toString(),
                subgraphData?.asset.decimals,
                netValueInAsset > 0 ? 5 : 2
              )} ${subgraphData?.asset.symbol}`
            : "--",
        },
        claimableSommReward:
          userStakes?.totalClaimAllRewards || undefined,
        userStakes,
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
