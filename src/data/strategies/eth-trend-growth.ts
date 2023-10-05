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

export const ethTrendGrowth: CellarData = {
  name: "ETH Trend Growth",
  slug: config.CONTRACT.ETH_TREND_GROWTH.SLUG,
  dashboard:
    "https://debank.com/profile/0x6c51041a91c91c86f3f08a72cb4d3f67f1208897",
  tradedAssets: ["USDC", "YieldETH", "YieldUSD"],
  launchDate: new Date(Date.UTC(2023, 8, 21, 18, 0, 0, 0)),
  cellarType: CellarType.automatedPortfolio,
  description: `Maximize your yield while outperforming the market.`,
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Compound", "Uniswap V3", "Morpho", "Maker"],
  strategyAssets: ["USDC", "YieldETH", "YieldUSD"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Silver Sun Capital Investments & Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize your yield while outperforming the market.`,
    highlights: `
    - Rebalance between Real Yield ETH and Real Yield USD to maximize real yield in any market environment.
    - Use trend following strategies to gain exposure to ETH during uptrends to maximize exposure to upside volatility and then fully exit to stablecoins to avoid drawdowns.`,
    description: `
    We have been optimizing our trend-following strategy with ETH over the past 2 years to identify the best indicators that best determine when we should be fully exposed to ETH to maximize exposure to upside volatility while also setting a dynamic stop loss to minimize drawdowns. Since this strategy is focused on the daily timeframe, the trading costs are minimal to execute this strategy, and the yields from Real Yield ETH will be helpful to grow the ETH position since the average trade is held for 2-3 months based on the backtested data. When the trend-following strategy flips bearish and it is confirmed via a daily market close, the long ETH position is exited to Real Yield USD so stablecoin yield is generated while the strategy is not exposed to ETH downside volatility which minimizes drawdowns.
    
    Note that ETH Trend Growth and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault is denominated in USDC but exposes you to volatile crypto assets, which carry a risk of potential loss.`,
  },
  depositTokens: {
    list: ["USDC"],
  },
  config: {
    id: config.CONTRACT.ETH_TREND_GROWTH.ADDRESS,
    cellarNameKey: CellarNameKey.ETH_TREND_GROWTH,
    lpToken: {
      address: config.CONTRACT.ETH_TREND_GROWTH.ADDRESS,
      imagePath: "/assets/icons/eth-trend-growth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.ETH_TREND_GROWTH.ADDRESS,
      abi: config.CONTRACT.ETH_TREND_GROWTH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    staker: {
      address: config.CONTRACT.ETH_TREND_GROWTH_STAKER.ADDRESS,
      abi: config.CONTRACT.ETH_TREND_GROWTH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.USDC,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
