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
// import { EETHIcon } from "components/_icons" need to do icon for osETH
import { chainSlugMap } from "data/chainConfig"

export const turboosETH: CellarData = {
  name: "Turbo osETH",
  slug: config.CONTRACT.TURBO_EETH.SLUG,
  tradedAssets: ["WETH", "osETH", "rETH"],
  launchDate: new Date(Date.UTC(2024, 1, 24, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your osETH exposure in this multi-strategy LP vault.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Balancer", "Morpho", "AAVE"],
  strategyAssets: ["WETH", "osETH", "rETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 16,
    protocol: 4,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your osETH exposure in this multi-strategy LP vault.`,

    highlights: `
    - Dynamically rebalance between osETH LP opportunities.
    - Uniswap V3 concentrated liquidity expertise.
    - Fully automated with built-in auto-compounding.`,

    description: `Gain exposure to osETH liquidity provision opportunities through this dynamic and evolving vault.
    
    Note that Turbo eETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - This vault has exposure to osETH, an emerging LST, which means that it is more susceptible to depegs than its more established counterparts.`,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "6%",
  },

  dashboard:
    "https://debank.com/profile/0x9a7b4980C6F0FCaa50CD5f288Ad7038f434c692e", //need to update
  depositTokens: {
    list: ["WETH", "osETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_OSETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_OSETH,
    lpToken: {
      address: config.CONTRACT.TURBO_OSETH.ADDRESS,
      imagePath: "/assets/icons/Turbo-osETH.png",
    },
    //cellar router can be removed?
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_OSETH.ADDRESS,
      abi: config.CONTRACT.TURBO_OSETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.TURBO_OSETH_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_OSETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.OSETH_ETHEREUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
