import BigNumber from "bignumber.js"
import { AaveV2CellarV2 } from "src/abi/types"
import { CellarData } from "../types"

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const fetchCellarData = async (contract: AaveV2CellarV2) => {
  try {
    const name = await contract.name()
    const activeAsset = await contract.asset()
    const maxLocked = new BigNumber(
      (await contract.maxLocked()).toString()
    )
    const totalAssets = new BigNumber(
      (await contract.totalAssets()).toString()
    )
    const accrualPeriod = new BigNumber(
      (await contract.accrualPeriod()).toString()
    )
    const accrualPeriodsInYear = yearInSecsBN.dividedBy(accrualPeriod)
    const apy = maxLocked
      .dividedBy(totalAssets)
      .multipliedBy(accrualPeriodsInYear)
      .multipliedBy(100)

    const cellarData: CellarData = {
      activeAsset,
      name,
      maxLocked,
      accrualPeriod,
      totalAssets,
      apy,
    }

    return cellarData
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
