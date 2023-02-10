import { BigNumber, BigNumberish } from "ethers"

export const gasLimitMargin = (
  gasEstimated: BigNumber,
  margin?: number
) =>
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
    console.warn("Fail to estimate gas, using known gas limit")
    return knownGasLimit
  }
}

const PAD = [1.15, 1.3, 1.45, 1.6, 1.75]

/**
 *
 * @example
 * const gasLimitEstimated = await estimateGasLimitWithRetry(
 *     cellarRouterSigner.estimateGas.depositAndSwap,
 *     cellarRouterSigner.callStatic.depositAndSwap,
 *     [
 *       payload.cellarAddress,
 *       1,
 *       swapData,
 *       amountInWei,
 *       payload.selectedToken?.address!,
 *     ],
 *     600000,
 *     1000000
 *   )
 */
export const estimateGasLimitWithRetry = async (
  fnEstimateGas: any,
  fnCallStatic: any,
  args: any[],
  knownGasLimit: BigNumberish,
  maxGasLimit?: BigNumberish
) => {
  const gasEstimatedRes = await estimateGasLimit(
    fnEstimateGas(...args),
    knownGasLimit,
    1
  )
  let gasLimitEstimated: BigNumber | undefined =
    BigNumber.from(gasEstimatedRes)

  let count = 1
  const maxTries = 5
  while (count <= maxTries) {
    try {
      const gasLimit = gasLimitMargin(
        gasLimitEstimated as BigNumber,
        PAD[count - 1]
      )
      const tx = await fnCallStatic(...args, {
        gasLimit,
      })
      if (tx) {
        gasLimitEstimated = gasLimit
        break
      }
    } catch (e) {
      if (count === maxTries) {
        const lastTryGasLimit = BigNumber.from(maxGasLimit || 1000000)
        try {
          const tx = await fnCallStatic(...args, {
            gasLimitEstimated: lastTryGasLimit,
          })
          if (tx) {
            gasLimitEstimated = lastTryGasLimit
          }
        } catch (error) {
          throw new Error("GAS_LIMIT_ERROR")
        }
      }
      count++
    }
  }
  return gasLimitEstimated
}
