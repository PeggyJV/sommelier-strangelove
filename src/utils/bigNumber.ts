import BigNumber from "bignumber.js"

export const ZERO = new BigNumber(0)

export const formatDecimals = (
  value: string,
  decimals?: number,
  fixed?: number
) => {
  const conversion = decimals
    ? new BigNumber(value)
        .dividedBy(10 ** decimals)
        .toFixed(fixed || 6)
        .toString()
    : "0"

  return conversion
}

export function convertDecimals(
  value: BigNumber | string,
  decimals: BigNumber | number
) {
  const d =
    typeof decimals === "number" ? decimals : decimals.toNumber()

  // TS can't refine value to BigNumber using a ternary
  let v: BigNumber
  if (typeof value === "string") {
    v = new BigNumber(value)
  } else {
    v = value
  }

  return v.dividedBy(10 ** d)
}
