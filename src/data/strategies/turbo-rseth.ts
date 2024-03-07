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

export const turborsETH: CellarData = {
  name: "Turbo rsETH",
  slug: config.CONTRACT.TURBO_RSETH.SLUG,
  tradedAssets: ["WETH", "rsETH"],
  launchDate: new Date(Date.UTC(2024, 1, 29, 15, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Your gateway to EigenLayer liquid restaking and Kelp's DeFi ecosystem.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Morpho Blue", "Balancer", "Curve"],
  strategyAssets: ["WETH", "rsETH"],
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
    goals: `Your gateway to EigenLayer liquid restaking and Kelp's DeFi ecosystem.`,

    highlights: `
    - Accepts WETH and rsETH deposits.
    - Leverage loop rsETH for more EigenLayer and Kelp Miles (subject to borrow capacity on Morpho Blue).
    - Dynamically liquidity provision across multiple DEXs.
    - Fully automated with built-in auto compounding.`,

    description: `Your gateway to EigenLayer liquid restaking and Kelp's DeFi ecosystem.
    
    Note that Turbo rsETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,

    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault does liquidity provision which can result in impermanent loss.
    - This vault uses leverage, which means there is liquidation risk.
    `,
  },
  dashboard:
    "https://debank.com/profile/0x1dffb366b5c5a37a12af2c127f31e8e0ed86bdbe",
  depositTokens: {
    list: ["WETH", "rsETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_RSETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_RSETH,
    lpToken: {
      address: config.CONTRACT.TURBO_RSETH.ADDRESS,
      imagePath: "/assets/icons/turbo-rseth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_RSETH.ADDRESS,
      abi: config.CONTRACT.TURBO_RSETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.TURBO_RSETH_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_RSETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    badges: [
      {
        customStrategyHighlight: "3x Kelp Miles",
        customStrategyHighlightColor: "#00C04B",
      },
      {
        customStrategyHighlight: "EigenLayer Points",
        customStrategyHighlightColor: "#00C04B",
      },
    ],
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
  },
}
