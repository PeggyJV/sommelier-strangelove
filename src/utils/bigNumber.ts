import BigNumber from "bignumber.js"

export const getCalulatedTvl = (tvlTotal: string, asset: any) => {
  return new BigNumber(tvlTotal)
    .dividedBy(10 ^ asset?.decimals)
    .toString()
}
