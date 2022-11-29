import BigNumber from "bignumber.js"
import { useUserStakes } from "data/hooks/useUserStakes"
import { CellarV0815, CellarV0816 } from "src/abi/types"

export const getCellarShareBalance = async ({
  cellarContract,
  lpToken,
  userStakes,
}: {
  cellarContract: CellarV0815 | CellarV0816
  lpToken?: string
  userStakes?: ReturnType<typeof useUserStakes>["data"]
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
