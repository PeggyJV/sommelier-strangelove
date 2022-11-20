import { config } from "utils/config"
import {
  CellarKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { depositTokenListWithWethWbtc } from "../tokenConfig"

export const steadyBtc = {
  name: "Steady BTC",
  cellarType: CellarType.automatedPortfolio,
  description: `Capture the majority of BTC price breakouts, limit losses through trailing tops. "Risk first" approach - capital preservation is prioritized over capital growth.`,
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2%",
  managementFeeTooltip:
    "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
  protocols: "Uniswap V3",
  strategyAssets: [
    "WBTC",
    "WETH",
    "USDC",
    "AMPL",
    "BUSD",
    "DAI",
    "FEI",
    "FRAX",
    "GUSD",
    "USDP",
    "RAI",
    "sUSD",
    "TUSD",
    "USDT",
  ],
  performanceSplit: {
    protocol: 2.5,
    "strategy provider": 7.5,
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

    highlights: `The cellar:

      - "Risk first" approach - capital preservation is more important than capital growth.

      - Always defined risk for every position prevailing from trade inception until trade exit.

      - Each trade strategy comprises two independent trade orders: 1 "Workhorse" with a fixed target and stop + 1 "Racehorse" with a trailing stop.`,
    description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is more important than capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."

      The trade management technique of BTC Breakout strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the ""How it works"" section for detailed strategy performance explanations.

      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed to be held over a medium to the long term (6 months to a year). In this time, the benefits of being in the strategy are expected to emerge."`,
    backtesting: `
      Notes: Performance of the strategy from May 2021-September 2022. Black line for benchmark

      Backtest results:
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
    list: depositTokenListWithWethWbtc,
  },

  config: {
    id: config.CONTRACT.STEADY_ETH.ADDRESS,
    lpToken: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      // STILL NEED TO UPDATE THIS ICON
      imagePath: "/assets/icons/eth-btc-mom.svg",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER.ABI,
      key: CellarRouterKey.CELLAR_ROUTER,
    },
    cellar: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC.ABI,
      key: CellarKey.AAVE_V2_STABLE_CELLAR,
    },
    staker: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC.ABI,
      key: StakerKey.AAVE_STAKER,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
  },
  faq: [
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
        "Strategies are best suited to investors who fully understand their risk appetite. The algorithm does not have any “timing” bias.",
    },
  ],
}
