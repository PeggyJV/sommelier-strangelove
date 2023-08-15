import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const turboSWETH: CellarData = {
  name: "Turbo SWETH",
  slug: config.CONTRACT.TURBO_SWETH.SLUG,
  tradedAssets: ["SWETH", "WETH"],
  launchDate: new Date("2023-08-24T14:00:00.000Z"),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your SWETH across an evolving set of LP strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "Platform fee split: 0.75% for Strategy provider and 0.25% for protocol",
  protocols: ["Uniswap V3", "Balancer"],
  strategyAssets: ["SWETH", "WETH"],
  performanceSplit: {
    depositors: 75,
    "strategy provider": 18.75,
    protocol: 6.25,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Sevens Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your SWETH across an evolving set of LP strategies.`,

    highlights: `
      - Capable of pursuing multiple SWETH yield opportunities.
      - Uniswap V3 tick optimization.
      - Fully automated with built-in auto compounding.`,

    description: `
    The initial phase of Turbo SWETH will concentrate on optimizing ticks within Uniswap v3 SWETH-ETH pairs due to the vault’s potential to capture sustainable real yield. The vault may also undertake a "peg defense" strategy by cost-effectively acquiring SWETH from the market and establishing a narrow liquidity range close to parity. This strategic move aims to arbitrage the SWETH peg to its implied value enhancing yield for vault users.

    Lastly, the vault will have the option to allocate to SWETH pools on Balancer if yields are favorable, ensuring that Turbo SWETH users access the best possible yields. As SWETH's presence continues to expand across the Liquid Staking DeFi ecosystem and Sommelier's roster of protocol integrations widens, the Turbo SWETH vault stands poised to tap into emerging yield opportunities.

    Note that Turbo SWETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  depositTokens: {
    list: ["SWETH"],
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  config: {
    id: config.CONTRACT.TURBO_SWETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_SWETH,
    lpToken: {
      address: config.CONTRACT.TURBO_SWETH.ADDRESS,
      imagePath: "/assets/icons/sweth.png", // TODO: UPDATE TO CORRECT IMAGE ONCE CREATED (turbo-sweth.png)
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_SWETH.ADDRESS,
      abi: config.CONTRACT.TURBO_SWETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
    },
    staker: {
      address: config.CONTRACT.TURBO_SWETH.ADDRESS,
      abi: config.CONTRACT.TURBO_SWETH.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS, // TODO: This is black pearls
    //!!!!!!!
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
