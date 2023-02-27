import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps, StakerKey } from "data/types"
import { StrategyContracts, StrategyData } from "../types"
import { getUserShareBalance } from "./getUserShareBalance"
import {
  CellarStakingV0815,
  CellarV0815,
  CellarV0816,
} from "src/abi/types"
import { getUserStakes } from "../CELLAR_STAKING_V0815/getUserStakes"
import { formatUSD } from "utils/formatCurrency"

export const getUserData = async ({
  address,
  contracts,
  strategyData,
  userAddress,
  sommPrice,
}: {
  address: string
  contracts: StrategyContracts
  strategyData: StrategyData
  userAddress: string
  sommPrice: string
}) => {
  const userDataRes = await (async () => {
    const strategy = Object.values(cellarDataMap).find(
      ({ config }) => config.cellar.address === address
    )!
    const config: ConfigProps = strategy.config!

    const shares = await getUserShareBalance({
      cellarContract: contracts.cellarContract as
        | CellarV0815
        | CellarV0816,
      decimals: strategyData?.activeAsset?.decimals,
      address: userAddress,
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

    const netValue =
      ((shares && shares.value.toNumber()) || 0) +
      (userStakes ? userStakes.claimAllRewardsUSD.toNumber() : 0) +
      (userStakes
        ? Number(userStakes.totalBondedAmount.formatted)
        : 0)

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
