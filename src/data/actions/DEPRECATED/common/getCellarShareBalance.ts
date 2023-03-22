import BigNumber from "bignumber.js"
import { getUserStakes } from "data/actions/CELLAR_STAKING_V0815/getUserStakes"
import { CellarV0815, CellarV0816 } from "src/abi/types"

export const getCellarShareBalance = async ({
  cellarContract,
  lpToken,
  userStakes,
}: {
  cellarContract: CellarV0815 | CellarV0816
  lpToken?: string
  userStakes?: Awaited<ReturnType<typeof getUserStakes>>
}) => {
  try {
    if (!lpToken) {
      throw new Error("lpToken is undefined")
    }
    if (!userStakes) {
      throw new Error("userStakes is undefined")
    }
    const shares = new BigNumber(lpToken)
      .plus(userStakes.totalBondedAmount.value)
      .toFixed()

    const cellarSharebalanceRes =
      await cellarContract.convertToAssets(shares)
    const cellarShareBalance = new BigNumber(
      cellarSharebalanceRes.toString()
    )

    return cellarShareBalance
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
