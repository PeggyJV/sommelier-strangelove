import BigNumber from "bignumber.js"
import { formatUSD, toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { GetPositionQuery } from "generated/subgraph"
import { getPNL } from "utils/pnl"

export const calculateUserData = async ({
  aAssetDecimals,
  cellarShareBalance,
  claimAllRewardsUSD,
  totalBondedAmount,
  totalClaimAllRewards,
  positionData,
}: {
  aAssetDecimals?: number
  cellarShareBalance?: BigNumber
  claimAllRewardsUSD?: BigNumber
  totalBondedAmount?: BigNumber
  totalClaimAllRewards?: BigNumber
  positionData?: GetPositionQuery
}) => {
  try {
    if (
      !aAssetDecimals ||
      !cellarShareBalance ||
      !claimAllRewardsUSD ||
      !totalBondedAmount ||
      !totalClaimAllRewards
    ) {
      throw new Error("props undefined")
    }
    const netValue = (() => {
      let nv = new BigNumber(
        toEther(
          cellarShareBalance?.toString(),
          aAssetDecimals,
          false,
          2
        )
      )
      if (claimAllRewardsUSD) {
        nv = nv.plus(claimAllRewardsUSD)
      }
      const formattedNetValue = nv.toFixed(2, 0)

      return {
        value: nv,
        formatted: formatUSD(formattedNetValue),
      }
    })()

    const totalBondedAmountFormatted =
      totalBondedAmount &&
      toEther(
        ethers.utils.parseUnits(totalBondedAmount?.toFixed(), 0),
        18,
        false,
        2
      )

    const ttlClaimAllrewards =
      totalClaimAllRewards &&
      toEther(totalClaimAllRewards?.toFixed(), 6, false, 2)

    const pnl = (() => {
      const userTvl = new BigNumber(
        cellarShareBalance?.toString() ?? 0
      )

      const currentUserDeposits = new BigNumber(
        positionData?.wallet?.currentDeposits ?? 0
      )
      // always 18 decimals from subgraph, must be normalized to 6
      const deposits = currentUserDeposits.div(
        new BigNumber(10).pow(18 - 6)
      )
      const result = getPNL(userTvl, deposits)
      return {
        value: result,
        formatted: `${result.toFixed(5, 0)}%`,
      }
    })()

    return {
      netValue,
      totalBondedAmount: {
        value: totalBondedAmount,
        formatted: totalBondedAmountFormatted,
      },
      totalClaimAllRewards: {
        value: totalClaimAllRewards,
        formatted: ttlClaimAllrewards,
      },
      pnl: pnl,
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}
