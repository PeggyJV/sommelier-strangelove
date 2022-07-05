import BigNumber from "bignumber.js"

export const getCalulatedTvl = (
  tvlTotal: string,
  decimals?: number
) => {
  const conversion = decimals
    ? new BigNumber(tvlTotal).dividedBy(10 ** decimals).toString()
    : "0"

  return conversion
}
