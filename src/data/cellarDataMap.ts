// TODO: Move content to a cms
import { config } from "utils/config"
import { CellarDataMap } from "./types"
import {
  aaveStable,
  ethBtcTrend,
  ethBtcMomentum,
  steadyEth,
  steadyBtc,
  steadyUni,
  steadyMatic,
  realYieldUsd,
  realYieldEth,
  defiStars,
  realYieldLink,
  realYield1Inch,
  realYieldENS,
  realYieldSNX,
  realYieldUNI,
  realYieldBTC,
  fraximal,
} from "./strategies"

let cellarConfig: CellarDataMap
if (config.cleargate.enabled) {
  cellarConfig = {
    [config.CONTRACT.REAL_YIELD_BTC.SLUG]: realYieldBTC,
    [config.CONTRACT.FRAXIMAL.SLUG]: fraximal,
    [config.CONTRACT.REAL_YIELD_ETH.SLUG]: realYieldEth,
    [config.CONTRACT.REAL_YIELD_USD.SLUG]: realYieldUsd,
    [config.CONTRACT.REAL_YIELD_UNI.SLUG]: realYieldUNI,
    [config.CONTRACT.REAL_YIELD_SNX.SLUG]: realYieldSNX,
    [config.CONTRACT.REAL_YIELD_ENS.SLUG]: realYieldENS,
    [config.CONTRACT.REAL_YIELD_1Inch.SLUG]: realYield1Inch,
    [config.CONTRACT.REAL_YIELD_LINK.SLUG]: realYieldLink,
    [config.CONTRACT.DEFI_STARS.SLUG]: defiStars,
    [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: ethBtcTrend,
    [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG]: ethBtcMomentum,
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
    [config.CONTRACT.STEADY_UNI.SLUG]: steadyUni,
    [config.CONTRACT.STEADY_MATIC.SLUG]: steadyMatic,
    [config.CONTRACT.STEADY_ETH.SLUG]: steadyEth,
    [config.CONTRACT.STEADY_BTC.SLUG]: steadyBtc,
  }
} else {
  cellarConfig = {
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
  }
}

export const cellarDataMap = cellarConfig
