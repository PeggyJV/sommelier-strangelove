import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { depositAssetTokenList } from "../tokenConfig"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const steadyBtc: CellarData = {
  deprecated: true,
  name: "Steady BTC",
  slug: config.CONTRACT.STEADY_BTC.SLUG,
  dashboard:
    "https://debank.com/profile/0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d",
  tradedAssets: ["WBTC", "USDC"],
  launchDate: new Date(2022, 10, 29, 12, 0, 0, 0), // 29 Nov 2022 12 pm est
  cellarType: CellarType.automatedPortfolio,
  description: `Capture the upside of BTC price breakouts, manage downside through trailing stops. “Risk first” approach - capital preservation is prioritized over capital growth.`,
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: "Uniswap V3",
  strategyAssets: ["WBTC", "USDC"],
  performanceSplit: {
    depositors: 90,
    "strategy provider": 7.5,
    protocol: 2.5,
  },
  strategyProvider: {
    logo: "/assets/images/patache.png",
    title: "Patache",
    href: "https://www.algoreturns.com/patache/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Catch trends early by predicting the significant movement of prices consistently and accurately. Capture the majority of BTC price breakouts, and limit losses through trailing stops.`,

    highlights: `The vault:

      - “Risk first” approach - capital preservation is prioritized over capital growth.

      - Always defined risk for every position prevailing from trade inception until trade exit.

      - Each trade strategy comprises two independent trade orders: 1
      “”Workhorse”" with a fixed target to lock in some return and stop + 1
      “”Racehorse”" with a trailing stop to capture market upside.`,
    description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is more important than capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."

      The trade management technique of BTC Breakout strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.

      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed to be held over a medium to the long term (6 months to a year). In this time, the benefits of being in the strategy are expected to emerge."`,
    backtesting: `
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div style="width:50%">
          Beginning Cellar Value: 500,000
          Period: May 2021 - September 2022
          No. of Trades: 58
          Worst Loss (Single Trade): -7,523
          Worst drawdown:  5.21%
          Annualized Sharpe Ratio: 226%
          Annualized Std.Dev of Return: 10.4%
        </div>
        <div style="width:50%">
          Annualized Mean Return: 23.4%
          Cumulative profit: 38.1%
          Win rate: 58%
          Loss rate: 42%
          Best month: 6.3%
          Worst month: -2.6%
        </div>
      </div>
      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
  },
  // overrideApy: {
  //   title: "Backtested APY",
  //   tooltip:
  //     "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
  //   value: "84.15%",
  // },
  depositTokens: {
    list: ["WBTC", "WETH", ...depositAssetTokenList],
  },

  config: {
    id: config.CONTRACT.STEADY_BTC.ADDRESS,
    cellarNameKey: CellarNameKey.STEADY_BTC,
    lpToken: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      imagePath: "/assets/icons/steady-btc.svg",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC.ABI,
      key: CellarKey.CELLAR_V0816,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.STEADY_BTC_STAKER.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    rewardTokenAddress: tokenConfigMap.SOMM_ETHEREUM.address,
    baseAsset: tokenConfigMap.USDC_ETHEREUM,
    chain: chainSlugMap.ETHEREUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "Who decides how to rebalance assets in the cellar?",
      answer:
        "Trade management and portfolio management rules are built into the algorithm smart contract. Please refer to the cellar description for details.",
    },
    {
      question: "What is the portfolio composition?",
      answer: `Portfolio composition is USDC + underlying strategy asset`,
    },
    {
      question: "How often is the portfolio rebalanced?",
      answer: "We expect 5-7 trades a month",
    },
    {
      question: "Does the cellar help to cut my losses?",
      answer:
        "All trades come with a defined risk and capital allocation. Please refer to the cellar description for details.",
    },
    {
      question: "Does the strategy work in all market conditions?",
      answer:
        "The algorithm is direction neutral i.e., it will generate Long and Short signals. However due to limitations in trade execution, only long signals will be supported by the cellar. Eventually both long and short trades will be supported by the cellar.",
    },
    {
      question: "When should the strategy be used?",
      answer:
        "Vaults are best suited to investors who fully understand their risk appetite. The algorithm does not have any “timing” bias.",
    },
  ],
}
