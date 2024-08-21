import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { CellarNameKey, ConfigProps } from "data/types"
import { tokenConfigMap } from "data/tokenConfig"
import { formatUnits } from "viem"

const ARB_TOKENS_IN_PERIOD_ETH = 30000
const ARB_TOKENS_IN_PERIOD_USD = 7500

const OP_TOKENS_IN_PERIOD = 5000

const PERIOD_DAYS = 7

export const getMerkleRewardsApy = async (
  cellarContract: any,
  cellarConfig: ConfigProps
) => {
  let tokenPrice;
  let tokensInPeriod;

  if (cellarConfig.chain.id === "arbitrum") {
    tokenPrice = await fetchCoingeckoPrice(tokenConfigMap.ARB_ARBITRUM, "usd");

    tokensInPeriod = cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH_ARB
      ? ARB_TOKENS_IN_PERIOD_ETH
      : ARB_TOKENS_IN_PERIOD_USD;

  } else {
    tokenPrice = await fetchCoingeckoPrice(tokenConfigMap.OP_OPTIMISM, "usd");
    tokensInPeriod = OP_TOKENS_IN_PERIOD;
  }

  const baseAssetPrice = await fetchCoingeckoPrice(cellarConfig.baseAsset, "usd");
  const totalValueStaked = await fetchTotalValueStaked(cellarContract);

  const totalValueStakedInUsd =
    parseFloat(formatUnits(totalValueStaked, cellarConfig.cellar.decimals)) * Number(baseAssetPrice)

  return ((tokensInPeriod * Number(tokenPrice)) /
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
