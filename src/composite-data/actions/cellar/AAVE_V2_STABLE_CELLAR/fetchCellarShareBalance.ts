import BigNumber from "bignumber.js"
import { AaveV2CellarV2 } from "src/abi/types"

export const fetchCellarShareBalance = async ({
  contract,
  aaveClrBalance,
  totalBondedAmount,
}: {
  contract: AaveV2CellarV2
  aaveClrBalance?: string
  totalBondedAmount?: string
}) => {
  try {
    if (!aaveClrBalance) {
      throw new Error("aaveClrBalance is undefined")
    }
    if (!totalBondedAmount) {
      throw new Error("totalBondedAmount is undefined")
    }

    const cellarSharebalance = await contract.convertToAssets(
      new BigNumber(aaveClrBalance).plus(totalBondedAmount).toFixed()
    )
    const res = new BigNumber(cellarSharebalance.toString())

    return res
  } catch (error) {
    console.warn(error)
    throw error
  }
}
