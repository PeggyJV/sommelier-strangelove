import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const turboezETH: CellarData = {
  name: "Turbo ezETH",
  slug: config.CONTRACT.TURBO_EZETH.SLUG,
  tradedAssets: ["WETH", "ezETH"],
  //need to update
  launchDate: new Date(Date.UTC(2024, 1, 28, 13, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Your gateway to EigenLayer liquid restaking and Renzo's DeFi ecosystem.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Morpho Blue", "Balancer", "Curve"],
  strategyAssets: ["WETH", "ezETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 17,
    protocol: 3,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Your gateway to EigenLayer liquid restaking and Renzo's DeFi ecosystem.`,

    highlights: `
    - Accepts WETH and ezETH deposits
    - Leverage loop ezETH for more EigenLayer and Renzo points (subject to borrow capacity on Morpho Blue)
    - Dynamically liquidity provision across multiple DEXs.
    - Fully automated with built-in auto compounding.`,

    description: `Your gateway to EigenLayer liquid restaking and Renzo's DeFi ecosystem.
    
    Note that Turbo ezETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,

    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault does liquidity provision which can result in impermanent loss.
    - This vault uses leverage, which means there is liquidation risk.
    `,
  },
  dashboard:
    "https://debank.com/profile/0x27500De405a3212D57177A789E30bb88b0AdbeC5",
  depositTokens: {
    list: ["WETH", "ezETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_EZETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_EETHV2,
    lpToken: {
      address: config.CONTRACT.TURBO_EZETH.ADDRESS,
      imagePath: "/assets/icons/turbo-ezeth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_EZETH.ADDRESS,
      abi: config.CONTRACT.TURBO_EZETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.TURBO_EZETH_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_EZETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
  },
}
