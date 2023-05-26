import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const realYieldSNX: CellarData = {
  name: "Real Yield SNX",
  slug: config.CONTRACT.REAL_YIELD_SNX.SLUG,
  tradedAssets: ["SNX", "WETH", "YieldETH"],
  launchDate: new Date(2023, 4, 31, 14, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0%",
  managementFeeTooltip:
    "Platform fee split: 0% for Strategy provider and 0% for protocol",
  protocols: ["AAVE"],
  strategyAssets: ["SNX", "WETH", "YieldETH"],
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
    The way the vault achieves this is by taking your deposited token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into a leveraged staking loop as well as the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through leveraged staking and Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.
    `,
  },
  depositTokens: {
    list: ["SNX"],
  },

  config: {
    noSubgraph: true,
    id: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
    baseApy: 4.4,
    cellarNameKey: CellarNameKey.REAL_YIELD_SNX,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
      imagePath: "/assets/icons/real-yield-snx.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_SNX.ADDRESS,
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
