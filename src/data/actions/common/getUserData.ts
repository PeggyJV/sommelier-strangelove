import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { StrategyContracts, StrategyData } from "../types"
import { CellarStakingV0815 } from "src/abi/types"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { formatUSD } from "utils/formatCurrency"
import { GetStrategyDataQuery } from "generated/subgraph"
import { formatDecimals } from "utils/bigNumber"
import { fetchBalance } from "@wagmi/core"

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
  sgData,
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
  sgData: GetStrategyDataQuery["cellar"]
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!
    const subgraphData = sgData

    const tokenPrice = (() => {
      if (!subgraphData?.shareValue) return 1

      const price = formatDecimals(subgraphData.shareValue, 6, 2)
      return Number(price)
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

    const userShares =
      (shares && Number(Number(shares.formatted).toFixed(2))) || 0

    const netValue =
      userShares * tokenPrice + bonded * tokenPrice + sommRewardsUSD
    console.log("userShares", userShares)
    console.log("tokenPrice", tokenPrice)
    console.log("bonded", bonded)
    console.log("sommRewardsUSD", sommRewardsUSD)
    console.log("netValue", netValue)
    const userStrategyData = {
      strategyData,
      userData: {
        netValue: {
          value: netValue,
          formatted: formatUSD(String(netValue)),
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
