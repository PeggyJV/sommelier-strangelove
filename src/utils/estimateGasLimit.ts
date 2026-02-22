import { pow } from "utils/bigIntHelpers"

export const gasLimitMargin = (
  gasEstimated: bigint,
  margin?: bigint
) => {
  const factor = margin ? margin : 130n
  return (gasEstimated * factor) / 100n;
}

export const estimateGasLimit = async (
  fn: Promise<bigint>,
  knownGasLimit: number,
  margin?: bigint
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
const PAD = [125n, 140n, 155n, 170n, 185n]

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
  fnEstimateGas: unknown,
  fnCallStatic: unknown,
  args: unknown[],
  knownGasLimit: number,
  account?: string
) => {
  const estimateGas = fnEstimateGas as (
    args: unknown[]
  ) => Promise<bigint>
  const callStatic = fnCallStatic as (
    args: unknown[],
    options: { gas: bigint; account?: string }
  ) => Promise<unknown>
  const gasEstimatedRes = await estimateGasLimit(
    estimateGas(args),
    knownGasLimit,
    100n
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

      const tx = await callStatic(args, {
        gas: gasLimit,
        account: account
      })
      if (tx) {
        gasLimitEstimated = gasLimit
        break
      }
    } catch (e) {
      if (count === maxTries) {
        const lastTryGasLimit = pow(BigInt(10), BigInt(10)) // Last try limit is very high -- users hate the gas limits
        try {
          const tx = await callStatic(args, {
            gas: lastTryGasLimit,
            account: account
          })
          if (tx) {
            gasLimitEstimated = lastTryGasLimit
          }
        } catch (error) {
          throw new Error("GAS_LIMIT_ERROR", { cause: error })
        }
      }
      count++
    }
  }
  return gasLimitEstimated
}
