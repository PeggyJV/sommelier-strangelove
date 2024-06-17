import { ethers } from "ethers"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { ConfigProps } from "data/types"
import { tokenConfigMap } from "data/tokenConfig"

const ARB_TOKENS_IN_PERIOD = 30000
const PERIOD_DAYS = 7
export const getMerkleRewardsApy = async (
  stakingContract: any,
  cellarConfig: ConfigProps
) => {
  const arbPrice = await fetchCoingeckoPrice(tokenConfigMap.ARB_ARBITRUM, "usd");
  const baseAssetPrice = await fetchCoingeckoPrice(cellarConfig.baseAsset, "usd");
  const totalValueStaked = await fetchTotalValueStaked(stakingContract);

  const totalValueStakedInUsd =
    parseFloat(ethers.utils.formatUnits(totalValueStaked, cellarConfig.cellar.decimals)) * Number(baseAssetPrice)

  return ((ARB_TOKENS_IN_PERIOD * Number(arbPrice)) /
      totalValueStakedInUsd) *
    (365 / PERIOD_DAYS) *
    100
}
const fetchTotalValueStaked = async (
  stakingContract: any
) => {
  try {
    const totalDeposits = await stakingContract.read.totalDeposits()
    return totalDeposits
  } catch (error) {
    console.error("Failed to fetch total value staked:", error)
    return ethers.BigNumber.from(0)
  }
}
