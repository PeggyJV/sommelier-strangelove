import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const realYieldBTC: CellarData = {
  name: "Real Yield BTC",
  slug: config.CONTRACT.REAL_YIELD_BTC.SLUG,
  tradedAssets: ["WBTC"],
  launchDate: new Date(2023, 6, 13, 10, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize WBTC-denominated yields through a dynamic and evolving set of strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "Platform fee split: 0.75% for Strategy provider and 0.25% for protocol",
  protocols: ["Morpho"],
  strategyAssets: ["WBTC"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Sevens Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize WBTC-denominated yields through a dynamic and evolving set of strategies.`,

    highlights: `
      - Capable of pursuing multiple WBTC yield sources.
      - 24/7 leverage monitoring reduces liquidiation risk.
      - Fully automated with built-in autocompounding. `,

    description: `
    The primary goal of Real Yield BTC is to make available sustainable WBTC-denominated yields through a dynamic and evolving set of strategies. Initially, the vault will use Morpho for efficient leveraged ETH staking against WBTC collateral. The vault may additionally borrow ETH to deposit into Real Yield ETH. In the future, there is a possibility for Real Yield BTC to evolve its capabilities by making use of other protocol integrations or Sommelier vaults.

    Note that Real Yield BTC and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  depositTokens: {
    list: ["WBTC"],
  },

  config: {
    noSubgraph: true,
    id: config.CONTRACT.REAL_YIELD_BTC.ADDRESS,
    cellarNameKey: CellarNameKey.REAL_YIELD_BTC,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_BTC.ADDRESS,
      imagePath: "/assets/icons/real-yield-ens.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_BTC.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD.ABI,
      key: CellarKey.CELLAR_V2,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_BTC_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_BTC_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the ENS of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
