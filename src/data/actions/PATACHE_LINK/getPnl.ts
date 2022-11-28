import BigNumber from "bignumber.js"
import { useUserStakes } from "data/hooks/useUserStakes"
import { GetPositionQuery } from "generated/subgraph"
import { Steady } from "src/abi/types"
import { getPNL } from "utils/pnl"
import { getCellarShareBalance } from "./getCellarShareBalance"

export const getPnl = async ({
  cellarContract,
  lpToken,
  userStakes,
  positionData,
}: {
  cellarContract: Steady
  lpToken?: string
  userStakes?: ReturnType<typeof useUserStakes>["data"]
  positionData?: GetPositionQuery
}) => {
  try {
    const cellarShareBalance = await getCellarShareBalance({
      cellarContract,
      lpToken,
      userStakes,
    })

    const userTvl = new BigNumber(cellarShareBalance?.toString() ?? 0)

    const currentUserDeposits = new BigNumber(
      positionData?.walletCellarData?.currentDeposits ?? 0
    )
    // always 18 decimals from subgraph, must be normalized to 6
    const deposits = currentUserDeposits.div(
      new BigNumber(10).pow(18 - 6)
    )
    const result = getPNL(userTvl, deposits)
    return {
      value: result,
      formatted: `${result.toFixed(2, 1)}%`,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
