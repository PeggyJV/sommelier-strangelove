import aaveV2CellarAbi from "../abi/aaveV2Cellar-v2.json"
import cellarRouter from "../abi/cellarRouter.json"
import sommStaking from "../abi/sommStaking.json"
import gravityBridge from "../abi/gravityBridge.json"
import clearGateCellar from "../abi/clearGateCellar.json"
import clearGateRouter from "../abi/clearGateRouter.json"
import { erc20ABI } from "wagmi"

// Adress should be saved as lowercase
/** Ensure Checksum Address  */
export const config = {
  SWAP: {
    // Do not set to a value less than 0.01.
    SLIPPAGE: 0.5,
  },
  CONTRACT: {
    AAVE_V2_STABLE_CELLAR: {
      // ADDRESS: "0xb03f18c2d28c29fa3811184f028c5bf6f11c2659",
      // ADDRESS: "0x7A9E1403fBb6C2AA0C180B976f688997E63FDA2c",
      // ADDRESS: "0x4E9FbDa4Dc1a207Db97e2BD66Fd1e8837c4DdD36",
      // ADDRESS: "0xF9f875BD4B1BC19693fe3Fe3C719f9deb11a2637",
      // ADDRESS: "0xd15135141f1217b8863cb1431ad71309ef22ceda",
      ADDRESS: "0x7bad5df5e11151dc5ee1a648800057c5c934c0d5",
      ABI: aaveV2CellarAbi,
      SLUG: "AAVE",
    },
    CELLAR_ROUTER: {
      // ADDRESS: "0xe30574344eB64c7c9012DE52D95b0b4f89f2C6d1",
      ADDRESS: "0x7286eC6A1425a5A3EC62DEF2a2Cdd2498e07086c",
      ABI: cellarRouter,
    },
    AAVE_STAKER: {
      // ADDRESS: "0xCEe04d9b75C282A630bA10583a3aC2C3c3599939",
      ADDRESS: "0x24691a00779d375A5447727E1610d327D04B3C5F",
      ABI: sommStaking,
    },
    USDC: {
      ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      ABI: erc20ABI,
    },
    DAI: {
      ADDRESS: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      ABI: erc20ABI,
    },
    WETH: {
      ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ABI: erc20ABI,
    },
    UST: {
      ADDRESS: "0xa693B19d2931d498c5B318dF961919BB4aee87a5",
      ABI: erc20ABI,
    },
    DEFI_PULSE: {
      ADDRESS: "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b",
      ABI: erc20ABI,
    },
    FEI: {
      ADDRESS: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
      ABI: erc20ABI,
    },
    SOMMELLIER: {
      ADDRESS: "0xa670d7237398238de01267472c6f13e5b8010fd1",
      DECIMALS: 6,
      ABI: erc20ABI,
    },
    BRIDGE: {
      ADDRESS: "0x69592e6f9d21989a043646fE8225da2600e5A0f7",
      ABI: gravityBridge,
    },
    ETH_BTC_TREND_CELLAR: {
      ADDRESS: "0x6b7f87279982d919bbf85182ddeab179b366d8f2",
      ABI: clearGateCellar,
      SLUG: "ETH-BTC-Trend",
    },
    ETH_BTC_MOMENTUM_CELLAR: {
      ADDRESS: "0x6e2dac3b9e9adc0cbbae2d0b9fd81952a8d33872",
      ABI: clearGateCellar,
      SLUG: "ETH-BTC-Momentum",
    },
    STEADY_ETH: {
      ADDRESS: "0x3f07a84ecdf494310d397d24c1c78b041d2fa622",
      SLUG: "Steady-ETH",
      ABI: sommStaking,
    },
    STEADY_BTC: {
      ADDRESS: "0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d",
      SLUG: "Steady-BTC",
      ABI: sommStaking,
    },
    CLEAR_GATE_TEST_CELLAR_A: {
      ADDRESS: "0xbfc413ea6cb68c05deda0d9aa7daf8e51a7dddff",
      ABI: clearGateCellar,
    },
    CLEAR_GATE_TEST_CELLAR_B: {
      ADDRESS: "0x8bdd3d5b889f3d0d735eb4db5d87782df2b4647d",
      ABI: clearGateCellar,
    },
    CLEAR_GATE_ROUTER: {
      ADDRESS: "0x1d90366b0154fbcb5101c06a39c25d26cb48e889",
      ABI: clearGateRouter,
    },
  },
  cleargate: {
    enabled: process.env.NEXT_PUBLIC_CLEARGATE_ENABLED === "true",
  },
}
