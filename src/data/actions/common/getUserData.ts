import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { StrategyContracts, StrategyData } from "../types"
import { CellarStakingV0815 } from "src/abi/types"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { formatUSD } from "utils/formatCurrency"
import { GetStrategyDataQuery } from "generated/subgraph"
import { formatDecimals } from "utils/bigNumber"
import { fetchBalance } from "@wagmi/core"
import { config } from "utils/config"

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

    const userShares =
      (shares && Number(Number(shares.formatted).toFixed(2))) || 0

    const netValue = (() => {
      if (
        shares === undefined ||
        userStakes === undefined ||
        bonded === undefined ||
        !subgraphData?.shareValue
      ) {
        return undefined
      }
      return (
        userShares * tokenPrice + bonded * tokenPrice + sommRewardsUSD
      )
    })()

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
