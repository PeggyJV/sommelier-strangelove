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

export const realYieldBTC: CellarData = {
  name: "Real Yield BTC",
  slug: config.CONTRACT.REAL_YIELD_BTC.SLUG,
  dashboard: "https://rybtc.sevenseas.capital/",
  tradedAssets: ["WBTC", "WETH"],
  launchDate: new Date(2023, 6, 13, 10, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize WBTC-denominated yields through a dynamic and evolving set of strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Morpho", "AAVE", "Uniswap V3"],
  strategyAssets: ["WBTC", "WETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize WBTC-denominated yields through a dynamic and evolving set of strategies.`,

    highlights: `
      - Capable of pursuing multiple WBTC yield sources.
      - 24/7 leverage monitoring reduces liquidation risk.
      - Fully automated with built-in auto-compounding.`,

    description: `
    The primary goal of Real Yield BTC is to make available sustainable WBTC-denominated yields through a dynamic and evolving set of strategies. Initially, the vault will use Morpho for efficient leveraged ETH staking against WBTC collateral. The vault may additionally borrow ETH to deposit into Real Yield ETH. In the future, there is a possibility for Real Yield BTC to evolve its capabilities by making use of other protocol integrations or Somm vaults.

    Note that Real Yield BTC and Somm vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Somm <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    risks: `All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault uses leverage which presents a risk for the vault to be liquidated. Although there are safeguards in place to help mitigate this, the liquidation risk is not eliminated.
    
    - This vault does liquidity provision which can result in impermanent loss.`,
  },
  depositTokens: {
    list: ["WBTC"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_BTC.ADDRESS,
    cellarNameKey: CellarNameKey.REAL_YIELD_BTC,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_BTC.ADDRESS,
      imagePath: "/assets/icons/real-yield-btc.png",
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
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_BTC_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_BTC_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    baseAsset: tokenConfigMap.WBTC_ETHEREUM,
    chain: chainSlugMap.ETHEREUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Somm have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.somm.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
