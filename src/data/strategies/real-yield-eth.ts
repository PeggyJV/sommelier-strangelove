import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const realYieldEth: CellarData = {
  name: "Real Yield ETH",
  slug: config.CONTRACT.REAL_YIELD_ETH.SLUG,
  popUpTitle: "Get Exclusive Real Yield Updates",
  popUpDescription:
    "Thank you for your trust. As a Real Yield vault user, you’re eligible for exclusive strategy updates directly from the strategist - 7 Seas. Delivered to your inbox every week. We’ll only use your email for this purpose.",
  tradedAssets: ["stETH", "cbETH", "rETH", "WETH"],
  launchDate: new Date(2023, 3, 12, 11, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize ETH yield through Aave and Compound leveraged staking and Uniswap V3 liquidity provision of ETH liquid staking tokens.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2.00%",
  managementFeeTooltip:
    "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
  protocols: ["AAVE", "Compound", "Uniswap V3"],
  strategyAssets: ["stETH", "cbETH", "rETH", "WETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas & DeFine Logic Labs",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize ETH yield through Aave and Compound leveraged staking and Uniswap V3 liquidity provision of ETH liquid staking tokens.`,

    highlights: `The vault:

      - Accumulates leverage using a method that is highly capital efficient and significantly reduces gas and flash loan fees.

      - Active strategy which optimally allocates capital across key protocols for best-in-class yields.

      - Optimizes Uniswap  V3 tick ranges.`,
    description: `Liquid Staked Tokens (LSTs) have gained significant traction since Ethereum's transition to proof-of-stake by allowing users to earn staking yield while also using that capital within DeFi, resolving the tension between securing the network and accessing liquidity to pursue DeFi opportunities. The innovations from liquid staking providers like Lido and RocketPool have seen LSTs become a growing component of Ethereum DeFi, and Real Yield ETH is poised to be a powerful vault for capturing organic yield across prominent LSTs.

    Note that Real Yield ETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
  },
  depositTokens: {
    list: ["cbETH", "rETH", "WETH"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
    baseApy: 10,
    cellarNameKey: CellarNameKey.REAL_YIELD_ETH,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
      imagePath: "/assets/icons/real-yield-eth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_ETH.ABI,
      key: CellarKey.CELLAR_V2,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_ETH_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_ETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "What are the risks?",
      answer: `It is important to acknowledge the inherent smart contract risk in the Sommelier contracts (despite extensive auditing) and the protocols the vault interacts with. Additionally, the vault utilizes leverage to generate yield, which poses a risk of liquidation. To help reduce this risk, the vault’s smart contracts enforce a minimum 1.05 health factor during each rebalance as a safety measure, and the vault closely monitors on-chain conditions to mitigate liquidation risk. Furthermore, the vault does not manage de-peg risk beyond the initial selection of widely used ETH liquid staked tokens. Lastly, it’s worth noting that withdrawing 100% of assets from the vault may not always be possible. Specifically, Uniswap V3 LP positions held by the vault are ineligible for immediate withdrawals, meaning users can only withdraw from certain Aave, Compound, and holding positions. Nevertheless, 7Seas and Define Logic Labs will ensure a percentage of funds are consistently maintained in liquid positions for withdrawal. This is also the case for Real Yield USD and some Yearn positions.`,
    },
  ],
}
