import { config } from "utils/config"
import {
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const realYieldUsd = {
  name: "Real Yield USD",
  slug: config.CONTRACT.REAL_YIELD_USD.SLUG,
  tradedAssets: ["USDC", "USDT", "DAI"],
  launchDate: new Date("2023-01-25T00:00:00.000Z"),
  cellarType: CellarType.yieldStrategies,
  description: `The only strategy in Defi to maximize USDC, USDT, and DAI yields across Aave, Compound and Uniswap V3.`,
  strategyType: "Stablecoin",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.5%",
  managementFeeTooltip:
    "Platform fee split: 0.4% for Strategy provider and 0.1% for protocol",
  protocols: ["AAVE", "Compound", "Uniswap V3"],
  strategyAssets: ["USDC", "USDT", "DAI"],
  performanceSplit: {
    depositors: 100,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `The only strategy in Defi to maximize USDC, USDT, and DAI yields across Aave, Compound and Uniswap V3.`,

    highlights: `The cellar:

      - The only active strategy which optimally allocates capital across key protocols for max yield.

      - Combines lending and LPing activities in a single strategy to deliver real yield others can't.

      - Optimizes Uniswap V3 LP tick ranges.`,
    description: `Real Yield USD has a real technological edge to deliver yields others can't.

    By “real yield” we mean yield that results from trading or lending activity (fees) rather than resulting from incentives. The primary sources of real yield exist on lending platforms like Aave and Compound, and decentralized exchanges like Uniswap. Because of this, Real Yield USD focuses on these three protocols and simultaneously allocates capital to Aave and Compound lending pools and Uniswap V3 LP pools in order to maximize yield.

    One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can manage the complexity of optimizing Uniswap V3 tick ranges. Many other yield strategies can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing strategies.
`,
    backtesting: `
        <img src="/assets/images/real-yield-usd-backtesting-image.jpg"/>
      `,
  },
  depositTokens: {
    list: ["USDC", "USDT", "DAI"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
    baseApy: 4.4,
    cellarNameKey: CellarNameKey.REAL_YIELD_USD,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
      imagePath: "/assets/icons/real-yield-usd.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_USD.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD.ABI,
      key: CellarKey.CELLAR_V2,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_USD_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor.",
    },
    {
      question: "What are the risks?",
      answer: `Risks include the typical risks associated with using stablecoins in DeFi. This includes smart contract risk and stablecoin depeg risk. Additionally, in the Cellars V2 architecture, Uniswap V3 liquidity positions are non-withdrawable. Because of this, withdrawing those assets from the strategy may not be possible at all times. However, the strategy provider, SevenSeas, will ensure that some percentage of funds are always kept in liquid positions to be withdrawn.This type of technical limitation is also present in other stablecoin yield opportunities like Origin USD (a Convex position may inhibit withdrawals) and Yearn positions.`,
    },
  ],
}
