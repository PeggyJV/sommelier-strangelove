import { pow } from "utils/bigIntHelpers"

export const gasLimitMargin = (
  gasEstimated: bigint,
  margin?: number
) => {
  const factor = BigInt(
    ((margin ? margin : 1.3) * 100).toFixed()
  ) / BigInt(100)
  return gasEstimated * factor
}

export const estimateGasLimit = async (
  fn: Promise<bigint>,
  knownGasLimit: number,
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

// Increase PAD values to provide larger buffer on retries
const PAD = [1.25, 1.4, 1.55, 1.7, 1.85]

/**
 *
 * @example
 * const gasLimitEstimated = await estimateGasLimitWithRetry(
 *     cellarRouterSigner.estimateGas.depositAndSwap,
 *     cellarRouterSigner.simulate.depositAndSwap,
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
  knownGasLimit: number,
  maxGasLimit?: number
) => {
  const gasEstimatedRes = await estimateGasLimit(
    fnEstimateGas(args),
    knownGasLimit,
    1
  )
  let gasLimitEstimated = BigInt(gasEstimatedRes)

  let count = 1
  const maxTries = 5
  while (count <= maxTries) {
    try {
      const gasLimit = gasLimitMargin(
        gasLimitEstimated,
        PAD[count - 1]
      )

      const tx = await fnCallStatic(args, {
        gas: gasLimit,
      })
      if (tx) {
        gasLimitEstimated = gasLimit
        break
      }
    } catch (e) {
      if (count === maxTries) {
        const lastTryGasLimit = pow(10, 30) // Last try limit is very high -- users hate the gas limits
        try {
          const tx = await fnCallStatic(args, {
            gas: lastTryGasLimit,
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
