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

export const morphoETH: CellarData = {
  name: "Morpho ETH Maximizer",
  slug: config.CONTRACT.MORPHO_ETH.SLUG,
  tradedAssets: ["WETH", "stETH", "wstETH"],
  launchDate: new Date(Date.UTC(2024, 0, 29, 15, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Supercharge your ETH lending and leveraged staking experience on Morpho Blue.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Morpho Blue"],
  strategyAssets: ["WETH", "stETH", "wstETH"],
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
    goals: `Supercharge your ETH lending and leveraged staking experience on Morpho Blue.`,

    highlights: `
    - Dynamically rebalance between lending and leveraged staking opportunities.
    - Leverage monitoring.
    - Fully automated with built-in auto-compounding.`,

    description: `Supercharge your ETH lending and leveraged staking experience on Morpho Blue.
    
    Note that Morpho ETH Maximizer and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault uses leverage, which means there is liquidation risk.`,
  },

  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "6%",
  },
  dashboard:
    "https://debank.com/profile/0xcf4b531b4cde95bd35d71926e09b2b54c564f5b6",

  depositTokens: {
    list: ["WETH", "stETH", "wstETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.MORPHO_ETH.ADDRESS,
    cellarNameKey: CellarNameKey.MORPHO_ETH,
    lpToken: {
      address: config.CONTRACT.MORPHO_ETH.ADDRESS,
      imagePath: "/assets/icons/morpho-eth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.MORPHO_ETH.ADDRESS,
      abi: config.CONTRACT.MORPHO_ETH.ABI,
      key: CellarKey.CELLAR_V2PT6,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.MORPHO_ETH_STAKER.ADDRESS,
      abi: config.CONTRACT.MORPHO_ETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
    show7DayAPYTooltip: true,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
