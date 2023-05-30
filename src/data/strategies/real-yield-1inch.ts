import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
} from "../types"

export const realYield1Inch: CellarData = {
  isContractNotReady: true,

  name: "Real Yield 1INCH",
  slug: config.CONTRACT.REAL_YIELD_1Inch.SLUG,
  tradedAssets: ["1Inch", "WETH", "YieldETH"],
  launchDate: new Date(2023, 4, 31, 14, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0%",
  managementFeeTooltip:
    "Platform fee split: 0% for Strategy provider and 0% for protocol",
  protocols: ["AAVE"],
  strategyAssets: ["1Inch", "WETH", "YieldETH"],
  performanceSplit: {
    depositors: 100,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Sevens Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Outperform lending yield.`,

    highlights: `
      - Automated leverage monitoring and yield compounding.
      - Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.
      - No lockups, withdraw your tokens at any time.`,

    description: `
    The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).    `,
  },
  depositTokens: {
    list: ["1Inch"],
  },

  config: {
    noSubgraph: true,
    id: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
    baseApy: 4.4,
    cellarNameKey: CellarNameKey.REAL_YIELD_1INCH,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
      imagePath: "/assets/icons/real-yield-one-inch.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_1Inch.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD.ABI,
      key: CellarKey.CELLAR_V2,
    },
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "What are the risks?",
      answer: `It is important to acknowledge the inherent smart contract risk in the Sommelier contracts (despite extensive auditing) and the protocols the vault interacts with. Additionally, the vault utilizes leverage to generate yield, which poses a risk of liquidation. To help reduce this risk, the vault’s smart contracts enforce a minimum health factor during each rebalance as a safety measure, and the vault closely monitors on-chain conditions to mitigate liquidation risk. Furthermore, the vault does not manage de-peg risk beyond the initial selection of widely used ETH liquid staked tokens. Lastly, it’s worth noting that withdrawing 100% of assets from the vault may not always be possible. Specifically, Uniswap V3 LP positions held by the vault are ineligible for immediate withdrawals, meaning users can only withdraw from certain Aave, Compound, and holding positions. Nevertheless, 7Seas and Define Logic Labs will ensure a percentage of funds are consistently maintained in liquid positions for withdrawal. This is also the case for Real Yield USD and some Yearn positions.      `,
    },
  ],
}
