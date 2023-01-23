import { BigNumber, BigNumberish } from "ethers"

const gasLimitMargin = (gasEstimated: BigNumber, margin?: number) =>
  gasEstimated.mul(margin ? margin : 1.1) // increase 10%

export const estimateGasLimit = async (
  fn: Promise<BigNumber>,
  knownGasLimit: BigNumberish,
  margin?: number
) => {
  try {
    const gas = await fn
    return gasLimitMargin(gas, margin).toString()
  } catch (error) {
    return knownGasLimit
  }
}
