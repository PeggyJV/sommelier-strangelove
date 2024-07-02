import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { ConfigProps } from "data/types"
import { tokenConfigMap } from "data/tokenConfig"
import { formatUnits } from "viem"

const ARB_TOKENS_IN_PERIOD = 30000
const PERIOD_DAYS = 7
export const getMerkleRewardsApy = async (
  cellarContract: any,
  cellarConfig: ConfigProps
) => {
  const arbPrice = await fetchCoingeckoPrice(tokenConfigMap.ARB_ARBITRUM, "usd");
  const baseAssetPrice = await fetchCoingeckoPrice(cellarConfig.baseAsset, "usd");
  const totalValueStaked = await fetchTotalValueStaked(cellarContract);

  const totalValueStakedInUsd =
    parseFloat(formatUnits(totalValueStaked, cellarConfig.cellar.decimals)) * Number(baseAssetPrice)

  return ((ARB_TOKENS_IN_PERIOD * Number(arbPrice)) /
      totalValueStakedInUsd) *
    (365 / PERIOD_DAYS) *
    100
}
const fetchTotalValueStaked = async (
  cellarContract: any
) => {
  try {
    const totalAssets = await cellarContract.read.totalAssets()
    return totalAssets
  } catch (error) {
    console.error("Failed to fetch total value staked:", error)
    return BigInt(0)
  }
}
