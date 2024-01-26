// TODO: Move content to a cms
import { config } from "utils/config"
import { CellarDataMap, CellarAddressDataMap } from "./types"
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
  turboSWETH,
  ethTrendGrowth,
  turboGHO,
  turboSTETH,
  turboSOMM,
  testArbitrumRealYieldUsd,
  turboeETH,
  turboSTETHstETHDeposit,
  testArbitrumMultiAssetDeposit,
  morphoETH,
} from "./strategies"

let cellarConfig: CellarDataMap
cellarConfig = {
  // ! NOTE THIS DETERMINES INITIAL ORDERING
  //[config.CONTRACT.TEST_ARBITRUM_REAL_YIELD_USD.SLUG]:testArbitrumRealYieldUsd, //! Multichain testing contract
  [config.CONTRACT.TURBO_EETH.SLUG]: turboeETH,
  [config.CONTRACT.REAL_YIELD_ETH.SLUG]: realYieldEth,
  [config.CONTRACT.TURBO_STETH.SLUG]: turboSTETH,
  [config.CONTRACT.REAL_YIELD_BTC.SLUG]: realYieldBTC,
  [config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.SLUG]:
    turboSTETHstETHDeposit,
  [config.CONTRACT.TURBO_SWETH.SLUG]: turboSWETH,
  [config.CONTRACT.REAL_YIELD_USD.SLUG]: realYieldUsd,
  [config.CONTRACT.FRAXIMAL.SLUG]: fraximal,
  [config.CONTRACT.TURBO_GHO.SLUG]: turboGHO,
  [config.CONTRACT.REAL_YIELD_LINK.SLUG]: realYieldLink,
  [config.CONTRACT.TURBO_SOMM.SLUG]: turboSOMM,
  [config.CONTRACT.ETH_TREND_GROWTH.SLUG]: ethTrendGrowth,
  [config.CONTRACT.DEFI_STARS.SLUG]: defiStars,
  [config.CONTRACT.REAL_YIELD_ENS.SLUG]: realYieldENS,
  [config.CONTRACT.REAL_YIELD_UNI.SLUG]: realYieldUNI,
  [config.CONTRACT.REAL_YIELD_SNX.SLUG]: realYieldSNX,
  [config.CONTRACT.REAL_YIELD_1Inch.SLUG]: realYield1Inch,
  [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: ethBtcTrend,
  [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG]: ethBtcMomentum,
  [config.CONTRACT.AAVE_V2_STABLE_CELLAR.SLUG]: aaveStable,
  [config.CONTRACT.STEADY_UNI.SLUG]: steadyUni,
  [config.CONTRACT.STEADY_MATIC.SLUG]: steadyMatic,
  [config.CONTRACT.STEADY_ETH.SLUG]: steadyEth,
  [config.CONTRACT.STEADY_BTC.SLUG]: steadyBtc,
}

// Create another map of String to CellarData
// ! For not ethereum cellars the key must be {cellarAddress}-{chainId}
let cellarAddressConfig: CellarAddressDataMap
cellarAddressConfig = {
  [config.CONTRACT.TEST_ARBITRUM_REAL_YIELD_USD.ADDRESS.toLowerCase() +
  "-arbitrum"]: testArbitrumRealYieldUsd,
  [config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ADDRESS.toLowerCase()]:
    turboSTETHstETHDeposit,
  [config.CONTRACT.TURBO_EETH.ADDRESS.toLowerCase()]: turboeETH,
  [config.CONTRACT.TURBO_SOMM.ADDRESS.toLowerCase()]: turboSOMM,
  [config.CONTRACT.TURBO_STETH.ADDRESS.toLowerCase()]: turboSTETH,
  [config.CONTRACT.ETH_TREND_GROWTH.ADDRESS.toLowerCase()]:
    ethTrendGrowth,
  [config.CONTRACT.TURBO_GHO.ADDRESS.toLowerCase()]: turboGHO,
  [config.CONTRACT.TURBO_SWETH.ADDRESS.toLowerCase()]: turboSWETH,
  [config.CONTRACT.REAL_YIELD_ETH.ADDRESS.toLowerCase()]:
    realYieldEth,
  [config.CONTRACT.REAL_YIELD_BTC.ADDRESS.toLowerCase()]:
    realYieldBTC,
  [config.CONTRACT.REAL_YIELD_USD.ADDRESS.toLowerCase()]:
    realYieldUsd,
  [config.CONTRACT.FRAXIMAL.ADDRESS.toLowerCase()]: fraximal,
  [config.CONTRACT.REAL_YIELD_LINK.ADDRESS.toLowerCase()]:
    realYieldLink,
  [config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS.toLowerCase()]:
    ethBtcTrend,
  [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS.toLowerCase()]:
    ethBtcMomentum,
  [config.CONTRACT.DEFI_STARS.ADDRESS.toLowerCase()]: defiStars,
  [config.CONTRACT.REAL_YIELD_ENS.ADDRESS.toLowerCase()]:
    realYieldENS,
  [config.CONTRACT.REAL_YIELD_UNI.ADDRESS.toLowerCase()]:
    realYieldUNI,
  [config.CONTRACT.REAL_YIELD_SNX.ADDRESS.toLowerCase()]:
    realYieldSNX,
  [config.CONTRACT.REAL_YIELD_1Inch.ADDRESS.toLowerCase()]:
    realYield1Inch,
  [config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS.toLowerCase()]:
    aaveStable,
  [config.CONTRACT.STEADY_UNI.ADDRESS.toLowerCase()]: steadyUni,
  [config.CONTRACT.STEADY_MATIC.ADDRESS.toLowerCase()]: steadyMatic,
  [config.CONTRACT.STEADY_ETH.ADDRESS.toLowerCase()]: steadyEth,
  [config.CONTRACT.STEADY_BTC.ADDRESS.toLowerCase()]: steadyBtc,
}

export const CellaAddressDataMap = cellarAddressConfig
export const cellarDataMap = cellarConfig
