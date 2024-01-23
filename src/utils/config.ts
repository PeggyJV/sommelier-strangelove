import cellarRouterV0815 from "../abi/cellar-router-v0.8.15.json"
import cellarRouterV0816 from "../abi/cellar-router-v0.8.16.json"
import cellarStakingV0815 from "../abi/cellar-staking-v.0.8.15.json"
import cellarStakingV0821 from "../abi/cellar-staking-v0.8.21.json"
import cellarV0815 from "../abi/cellar-v0.8.15.json"
import cellarV0816 from "../abi/cellar-v0.8.16.json"
import cellarV0821 from "../abi/cellar-v0.8.21.json"
import gravityBridge from "../abi/gravityBridge.json"
import { erc20ABI } from "wagmi"

// Adress should be saved as lowercase
/** Ensure Checksum Address  */
export const config = {
  SWAP: {
    // Do not set to a value less than 0.01.
    SLIPPAGE: 0.5,
  },
  CONTRACT: {
    TEST_ARBITRUM_REAL_YIELD_USD: {
      ADDRESS: "0xA73B0B48E26E4B8B24CeaD149252cc275deE99A6",
      SLUG: "Real-Yield-USD-Arbitrum",
      ABI: cellarV0821,
    },
    DEFI_PULSE: {
      ADDRESS: "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b",
      ABI: erc20ABI,
    },
    FEI: {
      ADDRESS: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
      ABI: erc20ABI,
    },
    BRIDGE: {
      ADDRESS: "0x69592e6f9d21989a043646fE8225da2600e5A0f7",
      ABI: gravityBridge,
    },
    CLEAR_GATE_TEST_CELLAR_A: {
      ADDRESS: "0xbfc413ea6cb68c05deda0d9aa7daf8e51a7dddff",
      ABI: cellarV0816,
    },
    CLEAR_GATE_TEST_CELLAR_B: {
      ADDRESS: "0x8bdd3d5b889f3d0d735eb4db5d87782df2b4647d",
      ABI: cellarV0816,
    },
    // Cellars
    AAVE_V2_STABLE_CELLAR: {
      // ADDRESS: "0xb03f18c2d28c29fa3811184f028c5bf6f11c2659",
      // ADDRESS: "0x7A9E1403fBb6C2AA0C180B976f688997E63FDA2c",
      // ADDRESS: "0x4E9FbDa4Dc1a207Db97e2BD66Fd1e8837c4DdD36",
      // ADDRESS: "0xF9f875BD4B1BC19693fe3Fe3C719f9deb11a2637",
      // ADDRESS: "0xd15135141f1217b8863cb1431ad71309ef22ceda",
      ADDRESS: "0x7bad5df5e11151dc5ee1a648800057c5c934c0d5",
      ABI: cellarV0815,
      SLUG: "AAVE",
    },
    ETH_BTC_TREND_CELLAR: {
      ADDRESS: "0x6b7f87279982d919bbf85182ddeab179b366d8f2",
      ABI: cellarV0816,
      SLUG: "ETH-BTC-Trend",
    },
    ETH_BTC_MOMENTUM_CELLAR: {
      ADDRESS: "0x6e2dac3b9e9adc0cbbae2d0b9fd81952a8d33872",
      ABI: cellarV0816,
      SLUG: "ETH-BTC-Momentum",
    },
    STEADY_ETH: {
      ADDRESS: "0x3f07a84ecdf494310d397d24c1c78b041d2fa622",
      SLUG: "Steady-ETH",
      ABI: cellarV0816,
    },
    STEADY_BTC: {
      ADDRESS: "0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d",
      SLUG: "Steady-BTC",
      ABI: cellarV0816,
    },
    STEADY_UNI: {
      ADDRESS: "0x6f069f711281618467dae7873541ecc082761b33",
      SLUG: "Steady-UNI",
      ABI: cellarV0816,
    },
    STEADY_MATIC: {
      ADDRESS: "0x05641a27c82799aaf22b436f20a3110410f29652",
      SLUG: "Steady-MATIC",
      ABI: cellarV0816,
    },
    REAL_YIELD_USD: {
      ADDRESS: "0x97e6e0a40a3d02f12d1cec30ebfbae04e37c119e",
      SLUG: "Real-Yield-USD",
      ABI: cellarV0816,
    },
    REAL_YIELD_ETH: {
      ADDRESS: "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec",
      SLUG: "Real-Yield-ETH",
      ABI: cellarV0816,
    },
    REAL_YIELD_LINK: {
      ADDRESS: "0x4068bdd217a45f8f668ef19f1e3a1f043e4c4934",
      SLUG: "Real-Yield-LINK",
      ABI: cellarV0816,
    },
    REAL_YIELD_ENS: {
      ADDRESS: "0x18ea937aba6053bc232d9ae2c42abe7a8a2be440",
      SLUG: "Real-Yield-ENS",
      ABI: cellarV0816,
    },
    REAL_YIELD_1Inch: {
      ADDRESS: "0xc7b69e15d86c5c1581dacce3cacaf5b68cd6596f",
      SLUG: "Real-Yield-1Inch",
      ABI: cellarV0816,
    },
    REAL_YIELD_SNX: {
      ADDRESS: "0xcbf2250f33c4161e18d4a2fa47464520af5216b5",
      SLUG: "Real-Yield-SNX",
      ABI: cellarV0816,
    },
    REAL_YIELD_UNI: {
      ADDRESS: "0x6a6af5393dc23d7e3db28d28ef422db7c40932b6",
      SLUG: "Real-Yield-UNI",
      ABI: cellarV0816,
    },
    REAL_YIELD_BTC: {
      ADDRESS: "0x0274a704a6d9129f90a62ddc6f6024b33ecdad36",
      SLUG: "Real-Yield-BTC",
      ABI: cellarV0816,
    },
    FRAXIMAL: {
      ADDRESS: "0xdbe19d1c3f21b1bb250ca7bdae0687a97b5f77e6",
      SLUG: "Fraximal",
      ABI: cellarV0816,
    },
    DEFI_STARS: {
      ADDRESS: "0x03df2a53cbed19b824347d6a45d09016c2d1676a",
      SLUG: "DeFi-Stars",
      ABI: cellarV0816,
    },
    TURBO_SWETH: {
      ADDRESS: "0xd33dad974b938744dac81fe00ac67cb5aa13958e",
      SLUG: "Turbo-SWETH",
      ABI: cellarV0821,
    },
    ETH_TREND_GROWTH: {
      ADDRESS: "0x6c51041a91c91c86f3f08a72cb4d3f67f1208897",
      SLUG: "ETH-Trend-Growth",
      ABI: cellarV0821,
    },
    TURBO_GHO: {
      ADDRESS: "0x0C190DEd9Be5f512Bd72827bdaD4003e9Cc7975C",
      SLUG: "Turbo-GHO",
      ABI: cellarV0821,
    },
    TURBO_SOMM: {
      ADDRESS: "0x5195222f69c5821f8095ec565E71e18aB6A2298f",
      SLUG: "Turbo-SOMM",
      ABI: cellarV0821,
    },
    TURBO_EETH: {
      ADDRESS: "0x9a7b4980C6F0FCaa50CD5f288Ad7038f434c692e",
      SLUG: "Turbo-eETH",
      ABI: cellarV0821,
    },
    TURBO_STETH: {
      ADDRESS: "0xfd6db5011b171b05e1ea3b92f9eacaeeb055e971",
      SLUG: "Turbo-STETH",
      ABI: cellarV0821,
    },
    TURBO_STETH_STETH_DEPOSIT: {
      ADDRESS: "0xc7372Ab5dd315606dB799246E8aA112405abAeFf",
      SLUG: "Turbo-STETH-(steth-deposit)",
      ABI: cellarV0821,
    },
    //need to update
    TURBO_OSETH: {
      ADDRESS: "0xF47Cd68Fb1CB26d634f069d78A9a5cA8d7a5cd01",
      SLUG: "Turbo-osETH",
      ABI: cellarV0821,
    },
    // Router
    CELLAR_ROUTER_V0815: {
      // ADDRESS: "0xe30574344eB64c7c9012DE52D95b0b4f89f2C6d1",
      ADDRESS: "0x7286eC6A1425a5A3EC62DEF2a2Cdd2498e07086c",
      ABI: cellarRouterV0815,
    },
    CELLAR_ROUTER_V0816: {
      ADDRESS: "0x1d90366b0154fbcb5101c06a39c25d26cb48e889",
      ABI: cellarRouterV0816,
    },
    // Staker
    AAVE_STAKER: {
      // ADDRESS: "0xCEe04d9b75C282A630bA10583a3aC2C3c3599939",
      ADDRESS: "0x24691a00779d375A5447727E1610d327D04B3C5F",
      ABI: cellarStakingV0815,
    },
    STEADY_ETH_STAKER: {
      ADDRESS: "0xae0e6024972b70601bc35405479af5cd372cc956",
      ABI: cellarStakingV0815,
    },
    STEADY_BTC_STAKER: {
      ADDRESS: "0xd1d02c16874e0714fd825213e0c13eab6dd9c25f",
      ABI: cellarStakingV0815,
    },
    ETH_BTC_TREND_STAKER: {
      ADDRESS: "0x9eEaBfFf5D15e8CedFD2F6C914c8826ba0a5FbBD",
      ABI: cellarStakingV0815,
    },
    ETH_BTC_MOMENTUM_STAKER: {
      ADDRESS: "0x6Ce314c39F30488B4a86B8892C81a5B7af83e337",
      ABI: cellarStakingV0815,
    },
    STEADY_UNI_STAKER: {
      ADDRESS: "0x74a9a6fab61e128246a6a5242a3e96e56198cbdd",
      ABI: cellarStakingV0815,
    },
    STEADY_MATIC_STAKER: {
      ADDRESS: "0x7da7e27e4bcc6ec8bc06349e1cef6634f6df7c5c",
      ABI: cellarStakingV0815,
    },
    REAL_YIELD_USD_STAKER: {
      ADDRESS: "0x8510f22bd1932afb4753b6b3edf5db00c7e7a748",
      ABI: cellarStakingV0815,
    },
    REAL_YIELD_ETH_STAKER: {
      ADDRESS: "0x955a31153e6764FE892757AcE79123ae996B0aFB",
      ABI: cellarStakingV0815,
    },
    REAL_YIELD_BTC_STAKER: {
      ADDRESS: "0x1eFF374fd9AA7266504144da861Fff9BBd31828e",
      ABI: cellarStakingV0815,
    },
    FRAXIMAL_STAKER: {
      ADDRESS: "0x290a42e913083edf5aefb241f8a12b306c19f8f9",
      ABI: cellarStakingV0815,
    },
    DEFI_STARS_STAKER: {
      ADDRESS: "0x0349b3c56adb9e39b5d75fc1df52eee313dd80d1",
      ABI: cellarStakingV0815,
    },
    TURBO_SWETH_STAKER: {
      ADDRESS: "0x69374d81fDc42adD0Fe1Dc655705e40b51B6681b",
      ABI: cellarStakingV0821,
    },
    ETH_TREND_GROWTH_STAKER: {
      ADDRESS: "0xb1D3948F4DCd7Aa5e89449080F3D88870aD0137A",
      ABI: cellarStakingV0821,
    },
    TURBO_GHO_STAKER: {
      ADDRESS: "0x6e5bb558D6C33Ca45dc9eFE0746a3C80BC3E70e1",
      ABI: cellarStakingV0821,
    },
    TEST_ARBITRUM_REAL_YIELD_USD_STAKER: {
      ADDRESS: "0xD7FE9DB494B28c55920700eA6E9347c49290A510",
      ABI: cellarStakingV0821,
    },
    TURBO_EETH_STAKER: {
      ADDRESS: "0x596C3f05bA9c6c356527E47989b3Ed26E2B3449d",
      ABI: cellarStakingV0821,
    },
  },
  cleargate: {
    enabled: process.env.NEXT_PUBLIC_CLEARGATE_ENABLED === "true",
  },
}

export const COUNT_DOWN_TIMEZONE = "UTC"
