import { BigNumber, BigNumberish } from "ethers"

const gasLimitMargin = (gasEstimated: BigNumber, margin?: number) =>
  gasEstimated
    .mul(Number((margin ? margin : 1.1) * 100).toFixed()) // default increase 10%
    .div(100)

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
