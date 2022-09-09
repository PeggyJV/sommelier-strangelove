import BigNumber from "bignumber.js"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { SommStaking } from "src/abi/types"
import { StakerData } from "../types"

export const fetchStakerData = async (contract: SommStaking) => {
  try {
    const rewardRateRes = await contract.rewardRate()
    const rewardRate = new BigNumber(
      rewardRateRes.toString()
    ).dividedBy(new BigNumber(10).pow(6))

    const totalDepositWithBoostRes =
      await contract.totalDepositsWithBoost()
    const totalDepositWithBoost = new BigNumber(
      totalDepositWithBoostRes.toString()
    ).dividedBy(new BigNumber(10).pow(18))
    const withUserDeposit = totalDepositWithBoost.plus(10000)

    const sommPrice = await fetchCoingeckoPrice("sommelier", "usd")
    if (!sommPrice) {
      throw new Error("sommelierPrice is undefined")
    }

    const potentialStakingApy = rewardRate
      .multipliedBy(sommPrice)
      .dividedBy(withUserDeposit)
      .multipliedBy(365 * 24 * 60 * 60)
      .multipliedBy(100)

    const stakerData: StakerData = {
      rewardRate: rewardRate,
      potentialStakingApy,
    }

    return stakerData
  } catch (error) {
    console.warn(error)
    throw error
  }
}
