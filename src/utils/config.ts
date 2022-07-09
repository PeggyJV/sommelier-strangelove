import aaveV2CellarAbi from "../abi/aaveV2Cellar-v2.json"
import cellarRouter from "../abi/cellarRouter.json"
import sommStaking from "../abi/sommStaking.json"
import { erc20ABI } from "wagmi"

/** Ensure Checksum Address  */
export const config = {
  SWAP: {
    SLIPPAGE: 5,
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
    },
    CELLAR_ROUTER: {
      // ADDRESS: "0xe30574344eB64c7c9012DE52D95b0b4f89f2C6d1",
      ADDRESS: "0x7286eC6A1425a5A3EC62DEF2a2Cdd2498e07086c",
      ABI: cellarRouter,
    },
    AAVE_STAKER: {
      ADDRESS: "0xCEe04d9b75C282A630bA10583a3aC2C3c3599939",
      // ADDRESS: "0x24691a00779d375A5447727E1610d327D04B3C5F",
      ABI: sommStaking,
    },
    USDC: {
      ADDRESS: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
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
  },
}
