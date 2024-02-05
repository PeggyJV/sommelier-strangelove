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
import { EETHIcon } from "components/_icons"
import { chainSlugMap } from "data/chainConfig"

export const turboeETHV2: CellarData = {
  name: "Turbo eETH V2",
  slug: config.CONTRACT.TURBO_EETHV2.SLUG,
  tradedAssets: ["WETH", "eETH", "weETH"],
  //need to update
  launchDate: new Date(Date.UTC(2023, 11, 13, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Use eETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: [
    "Curve",
    "Convex",
    "Uniswap V3",
    "Balancer",
    "Morpho Blue",
  ],
  strategyAssets: ["WETH", "eETH", "weETH"],
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
    goals: `Use eETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,

    highlights: `
    - Capable of simultaneously pursuing multiple eETH yield opportunities.
    - Dynamically liquidity provision across multiple DEXs.
    - Fully automated with built-in auto compounding.`,

    description: `To start, Turbo eETH will primarily provide DEX liquidity on Uniswap V3 and Balancer to eETH-ETH pairs. The vault will also do a small amount of ETH lending on Aave and Morpho as an alternate strategy to diversify its yield sources.
    
    Note that Turbo eETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,

    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault does liquidity provision which can result in impermanent loss.
    `,
  },
  //need to update
  dashboard:
    "https://debank.com/profile/0x729421F0E1fE6c849e5841DF373Db7019CC58610",
  depositTokens: {
    list: ["WETH", "eETH", "weETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_EETHV2.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_EETHV2,
    lpToken: {
      address: config.CONTRACT.TURBO_EETHV2.ADDRESS,
      imagePath: "/assets/icons/turbo-eethv2.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_EETHV2.ADDRESS,
      abi: config.CONTRACT.TURBO_EETHV2.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
    badges: [
      {
        customStrategyHighlight: "Emergent Asset",
        customStrategyHighlightColor: "purple.base",
      },
      {
        customStrategyHighlight: "ether.fi Loyalty Points",
        customStrategyHighlightColor: "#00C04B",
      },
    ],
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
