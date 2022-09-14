import BigNumber from "bignumber.js"

export interface CellarData {
  activeAsset: string
  name: string
  maxLocked: BigNumber
  accrualPeriod: BigNumber
  totalAssets: BigNumber
  apy: BigNumber
}

export interface CellarUserData {
  maxDeposit: BigNumber
  maxWithdraw: BigNumber
  netValue: BigNumber
}
