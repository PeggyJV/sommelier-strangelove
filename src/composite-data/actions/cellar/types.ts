import BigNumber from "bignumber.js"
import { BigNumber as BigNumberE } from "ethers"

export interface CellarData {
  activeAsset: string
  name: string
  maxLocked: BigNumber
  accrualPeriod: BigNumber
  totalAssets: BigNumber
  apy: BigNumber
}

export interface CellarUserData {
  maxDeposit: BigNumberE
  maxWithdraw: BigNumberE
  netValue: BigNumberE
}
