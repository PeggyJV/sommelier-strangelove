// TODO: Move content to a cms
import { config } from "utils/config"
import { CellarDataMap } from "./types"
import {
  aaveStable,
  ethBtcTrend,
  ethBtcMomentum,
  steadyEth,
  steadyBtc,
} from "./strategies"

let cellarConfig: CellarDataMap
if (config.cleargate.enabled) {
  cellarConfig = {
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
