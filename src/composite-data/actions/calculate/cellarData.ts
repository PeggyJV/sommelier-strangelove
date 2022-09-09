import BigNumber from "bignumber.js"
import { getCalulatedTvl } from "utils/bigNumber"
import { getExpectedApy } from "utils/cellarApy"
import { formatCurrency } from "utils/formatCurrency"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { tokenConfig } from "data/tokenConfig"
import { useBalance } from "wagmi"

export const calculateData = async ({
  activeAsset,
  addedLiquidityAllTime,
  apy,
  assetDecimals,
  liquidityLimit,
  potentialStakingApy,
  removedLiquidityAllTime,
  tvlTotal,
}: {
  aAsset?: ReturnType<typeof useBalance>[0]
  activeAsset?: string
  addedLiquidityAllTime?: string
  apy?: BigNumber
  assetDecimals?: number
  liquidityLimit?: string
  potentialStakingApy?: BigNumber
  removedLiquidityAllTime?: string
  tvlTotal?: string
}) => {
  try {
    if (
      !activeAsset ||
      !addedLiquidityAllTime ||
      !apy ||
      !assetDecimals ||
      !liquidityLimit ||
      !potentialStakingApy ||
      !removedLiquidityAllTime ||
      !tvlTotal
    ) {
      throw new Error("props undefined")
    }
    const cellarCap =
      liquidityLimit &&
      new BigNumber(liquidityLimit)
        .dividedBy(10 ** (assetDecimals || 0))
        .toString()

    const currentDepositsVal = formatCurrentDeposits(
      addedLiquidityAllTime,
      removedLiquidityAllTime
    )

    const calculatedTvl = tvlTotal && getCalulatedTvl(tvlTotal, 18)
    const tvmVal = formatCurrency(calculatedTvl)

    const { expectedApy, formattedCellarApy, formattedStakingApy } =
      getExpectedApy(apy, potentialStakingApy)

    const apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${formattedCellarApy}%) and Liquidity Mining Rewards (${formattedStakingApy}%)`

    const activeSymbol =
      activeAsset && getCurrentAsset(tokenConfig, activeAsset)?.symbol

    return {
      activeSymbol,
      apyLabel,
      cellarCap: {
        value: cellarCap,
        formatted: `${formatCurrency(cellarCap)} ${activeSymbol}`,
      },
      currentDepositsVal: {
        value: currentDepositsVal,
        formatted: `${formatCurrency(
          currentDepositsVal
        )} ${activeSymbol}`,
      },
      expectedApy: expectedApy.toFixed(1).toString() + "%",
      tvmVal: {
        value: tvmVal,
        formatted: `$${tvmVal} ${activeSymbol}`,
      },
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}
