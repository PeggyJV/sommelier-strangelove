import BigNumber from "bignumber.js"

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
