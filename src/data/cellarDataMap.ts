// TODO: Move content to a cms
import { config } from "utils/config"
import { CellarDataMap } from "./types"
import { aaveStable, ethBtcTrend, ethBtcMomentum } from "./strategies"

let cellarConfig: CellarDataMap
if (config.cleargate.enabled) {
  cellarConfig = {
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS]: aaveStable,
    [config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS]: ethBtcTrend,
    [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS]: ethBtcMomentum,
  }
} else {
  cellarConfig = {
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS]: aaveStable,
  }
}

export const cellarDataMap = cellarConfig
