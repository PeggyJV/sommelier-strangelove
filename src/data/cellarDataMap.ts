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
} from "./strategies"

let cellarConfig: CellarDataMap
if (config.cleargate.enabled) {
  cellarConfig = {
    [config.CONTRACT.REAL_YIELD_USD.SLUG]: realYieldUsd,
    [config.CONTRACT.STEADY_UNI.SLUG]: steadyUni,
    [config.CONTRACT.STEADY_MATIC.SLUG]: steadyMatic,
    [config.CONTRACT.STEADY_ETH.SLUG]: steadyEth,
    [config.CONTRACT.STEADY_BTC.SLUG]: steadyBtc,
    [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: ethBtcTrend,
    [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG]: ethBtcMomentum,
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
  }
} else {
  cellarConfig = {
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
  }
}

export const cellarDataMap = cellarConfig
