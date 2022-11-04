import { config } from "utils/config"
import { CellarDataMap } from "./types"
import { aaveStable, ethBtcTrend, ethBtcMomentum } from "./strategies"

interface CellarHomeDataMap {
  automatedPortofolio: CellarDataMap
  yieldStrategies: CellarDataMap
}

let cellarHomeConfig: CellarHomeDataMap

cellarHomeConfig = {
  automatedPortofolio: {
    [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: ethBtcTrend,
    [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG]: ethBtcMomentum,
  },
  yieldStrategies: {
    [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
  },
}

export const CellarHomeDataMap = cellarHomeConfig
