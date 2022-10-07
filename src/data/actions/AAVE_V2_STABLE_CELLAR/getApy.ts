import BigNumber from "bignumber.js"
import { AaveV2CellarV2, SommStaking } from "src/abi/types"
import { getExpectedApy } from "utils/cellarApy"

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const getApy = async (
  cellarContract: AaveV2CellarV2,
  stakerContract: SommStaking,
  sommPrice: string
) => {
  try {
    const maxLocked = new BigNumber(
      (await cellarContract.maxLocked()).toString()
    )
    const totalAssets = new BigNumber(
      (await cellarContract.totalAssets()).toString()
    )
    const accrualPeriod = new BigNumber(
      (await cellarContract.accrualPeriod()).toString()
    )
    const accrualPeriodsInYear = yearInSecsBN.dividedBy(accrualPeriod)
    const apy = maxLocked
      .dividedBy(totalAssets)
      .multipliedBy(accrualPeriodsInYear)
      .multipliedBy(100)

    const rewardRateRes = await stakerContract.rewardRate()
    const rewardRate = new BigNumber(
      rewardRateRes.toString()
    ).dividedBy(new BigNumber(10).pow(6))

    const totalDepositWithBoostRes =
      await stakerContract.totalDepositsWithBoost()
    const totalDepositWithBoost = new BigNumber(
      totalDepositWithBoostRes.toString()
    ).dividedBy(new BigNumber(10).pow(18))
    const withUserDeposit = totalDepositWithBoost.plus(10000)

    const potentialStakingApy = rewardRate
      .multipliedBy(sommPrice)
      .dividedBy(withUserDeposit)
      .multipliedBy(365 * 24 * 60 * 60)
      .multipliedBy(100)

    const { expectedApy, formattedCellarApy, formattedStakingApy } =
      getExpectedApy(apy, potentialStakingApy)

    const apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${formattedCellarApy}%) and Liquidity Mining Rewards (${formattedStakingApy}%)`

    return {
      apyLabel,
      expectedApy: expectedApy.toFixed(1).toString() + "%",
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
