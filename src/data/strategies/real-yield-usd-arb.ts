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

export const realYieldUsdArb: CellarData = {
  name: "Real Yield USD",
  slug: config.CONTRACT.REAL_YIELD_USD_ARB.SLUG,
  dashboard:
    "https://debank.com/profile/0x392B1E6905bb8449d26af701Cdea6Ff47bF6e5A8",
  tradedAssets: ["USDC", "USDT", "DAI"],
  launchDate: new Date(Date.UTC(2025, 0, 29, 15, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize stablecoin yield across Aave, Compound, Uniswap, Morpho and the DAI Savings Rate.`,
  strategyType: "Stablecoin",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Compound", "Uniswap V3", "Morpho", "Maker"],
  strategyAssets: ["USDC", "USDT", "DAI"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize stablecoin yield across Aave, Compound, Uniswap, Morpho and the DAI Savings Rate.`,

    highlights: `The vault:

      - The only active strategy which optimally allocates capital across key protocols for max yield.

      - Combines lending and LPing activities in a single strategy to deliver real yield others can't.

      - Optimizes Uniswap V3 LP tick ranges.`,
    description: `Real Yield USD has a real technological edge to deliver yields others can't.

    By “real yield” we mean yield that results from trading or lending activity (fees) rather than resulting from incentives. The primary sources of real yield exist on lending platforms like Aave and Compound, and decentralized exchanges like Uniswap. Because of this, Real Yield USD focuses on these three protocols and simultaneously allocates capital to Aave and Compound lending pools and Uniswap V3 LP pools in order to maximize yield.

    One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can manage the complexity of optimizing Uniswap V3 tick ranges. Many other yield strategies can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing strategies.
`,
    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault is mainly comprised of decentralized and centralized stablecoins, both of which can experience depeg events.
    
    - This vault does liquidity provision which can result in impermanent loss.
    `,
  },
  depositTokens: {
    list: ["USDC"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_USD_ARB.ADDRESS,
    baseApy: 4.4,
    cellarNameKey: CellarNameKey.REAL_YIELD_USD_ARB,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_USD_ARB.ADDRESS,
      imagePath: "/assets/icons/real-yield-usd-arb.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_USD_ARB.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD_ARB.ABI,
      key: CellarKey.CELLAR_V2,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_USD_ARB_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD_ARB_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    /*badges: [
      {
        customStrategyHighlight: "Now using DSR",
        customStrategyHighlightColor: "orange.base",
      },
    ],
    */
    baseAsset: tokenConfigMap.USDC_ARBITRUM,
    chain: chainSlugMap.ARBITRUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "What are the risks?",
      answer: `Risks include the typical risks associated with using stablecoins in DeFi. This includes smart contract risk and stablecoin depeg risk. Additionally, in the Cellars V2 architecture, Uniswap V3 liquidity positions are non-withdrawable. Because of this, withdrawing those assets from the strategy may not be possible at all times. However, the strategy provider, SevenSeas, will ensure that some percentage of funds are always kept in liquid positions to be withdrawn.This type of technical limitation is also present in other stablecoin yield opportunities like Origin USD (a Convex position may inhibit withdrawals) and Yearn positions.`,
    },
    {
      question:
        "What actions vault takes in extreme market situations/volatility cases?",
      answer:
        "In extreme market conditions, the vault will seek to take a conservative capital preservation stance.",
    },
  ],
}
