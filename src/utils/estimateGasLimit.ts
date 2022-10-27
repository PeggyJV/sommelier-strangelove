import { BigNumber, BigNumberish } from "ethers"

const gasLimitMargin = (gasEstimated: BigNumber) =>
  gasEstimated.mul(110).div(100) // increase 10%

export const estimateGasLimit = async (
  fn: Promise<BigNumber>,
  knownGasLimit: BigNumberish
) => {
  try {
    const gas = await fn
    return gasLimitMargin(gas).toString()
  } catch (error) {
    return knownGasLimit
  }
}
