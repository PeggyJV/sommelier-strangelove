import BigNumber from "bignumber.js"
import { CellarStakingV0815, CellarV0815 } from "src/abi/types"
import { getExpectedApy } from "utils/cellarApy"

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const getApy = async (
  cellarContract: CellarV0815,
  stakerContract: CellarStakingV0815,
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

    const stakingEnd = await stakerContract.endTimestamp()
    const isStakingOngoing = Date.now() < stakingEnd.toNumber() * 1000

    let potentialStakingApy = new BigNumber(0)
    if (isStakingOngoing) {
      potentialStakingApy = rewardRate
        .multipliedBy(sommPrice)
        .dividedBy(withUserDeposit)
        .multipliedBy(365 * 24 * 60 * 60)
        .multipliedBy(100)
    }

    const { expectedApy, formattedCellarApy, formattedStakingApy } =
      getExpectedApy(apy, potentialStakingApy)

    // Comment out because of rebalancing, Aave APY is 0.00% for the week.
    // const apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${formattedCellarApy}%) and Liquidity Mining Rewards (${formattedStakingApy}%)`
    const apyLabel = `Expected APY`

    return {
      apy,
      apyLabel,
      // Comment out because of rebalancing, Aave APY is 0.00% for the week.
      // expectedApy: expectedApy.toFixed(1).toString() + "%",
      expectedApy: "1.9%",
      potentialStakingApy:
        potentialStakingApy.toFixed(1).toString() + "%",
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}
