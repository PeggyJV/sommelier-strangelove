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
  tradedAssets: ["USDC", "USDC.e", "USDT", "DAI"],
  launchDate: new Date(Date.UTC(2024, 1, 22, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize stablecoin yield through dynamic lending optimization and liquidity provision.`,
  strategyType: "Stablecoin",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Compound", "Uniswap V3"],
  strategyAssets: ["USDC", "USDC.e", "USDT", "DAI"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 17,
    protocol: 3,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize stablecoin yield through dynamic lending optimization and liquidity provision.`,

    highlights: `The vault:

      - Dynamically rebalances between assets and lending protocols.

      - Optimizes Uniswap V3 tick ranges.

      - Fully automated with built-in auto-compounding.`,
    description: `Maximize stablecoin yield through dynamic lending optimization and liquidity provision.`,
    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault does liquidity provision which can result in impermanent loss.`,
  },
  depositTokens: {
    list: ["USDC", "USDC.e", "USDT", "DAI"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_USD_ARB.ADDRESS,
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
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    baseAsset: tokenConfigMap.USDC_ARBITRUM,
    chain: chainSlugMap.ARBITRUM,
    show7DayAPYTooltip: true,
    staker: {
      address: config.CONTRACT.REAL_YIELD_USD_ARB_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_USD_ARB_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
