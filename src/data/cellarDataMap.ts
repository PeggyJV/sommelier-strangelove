import { config } from "utils/config"
import {
  CellarDataMap,
  CellarKey,
  CellarRouterKey,
  StakerKey,
} from "./types"

export const cellarDataMap: CellarDataMap = {
  [config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS]: {
    name: "aave2",
    description:
      "The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis.",
    strategyType: "Stablecoin",
    strategyTypeTooltip: "Cellar uses Stablecoin lending",
    managementFee: "0.25%",
    protocols: "AAVE",
    strategyAssets: [
      "USDC",
      "GUSD",
      "BUSD",
      "USDT",
      "DAI",
      "FEI",
      "FRAX",
      "sUSD",
      "USDP",
    ],
    performanceSplit: {
      depositors: 90,
      protocol: 10,
    },
    strategyBreakdown: {
      goals: `The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis. The goal is to outperform a static strategy of lending any single stablecoin. Returns are amplified for Sommelier users as they will not suffer opportunity costs from passively sitting in less profitable lending positions at any given moment.`,
      strategy: `This strategy involves observation of several variables including Aave interest rates, rate volatility, gas fees, slippage estimations, and TVL. This data is the input for a custom predictive model which recommends position adjustments periodically. The entire process is automated as the model delivers a feed to Sommelier validators who relay necessary function calls to the Cellar.
      <img src="/assets/images/net-yield-over-time.png" alt="net yield over time" />`,
      "somm alpha": `The alpha Sommelier delivers for this strategy is generated by a brilliant model that determines the precise moment that is best to capitalize on new market conditions. For the first time in DeFi history, you can benefit from a dynamic model rather than relying on static vault architecture. Cellars are not limited by rigid smart contract code which only allows positions to be adjusted under a narrow set of circumstances.

      The Aave Strategy uses high-powered predictive analytics to respond instantly when opportunity arises. Every second, we are monitoring and predicting APYs, gas fees, price volatility, liquidity, slippage and more. Rather than a simple formula such as "if gas fees <= current_apy/12, {claim_rewards}", the Aave Strategy is continually primed with real-time data points to make intelligent decisions. We bring statistics to DeFi without compromising decentralization. This has never been possible until now.`,
    },
    strategyProvider: {
      logo: "/assets/images/seven-seas.png",
      title: "Seven Seas",
      href: "https://7seas.capital/",
      tooltip:
        "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
    },
    config: {
      id: config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
      lpToken: {
        address: config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
      },
      cellarRouter: {
        address: config.CONTRACT.CELLAR_ROUTER.ADDRESS,
        abi: config.CONTRACT.CELLAR_ROUTER.ABI,
        key: CellarRouterKey.CELLAR_ROUTER,
      },
      cellar: {
        address: config.CONTRACT.AAVE_V2_STABLE_CELLAR.ADDRESS,
        abi: config.CONTRACT.AAVE_V2_STABLE_CELLAR.ABI,
        key: CellarKey.AAVE_V2_STABLE_CELLAR,
      },
      staker: {
        address: config.CONTRACT.AAVE_STAKER.ADDRESS,
        abi: config.CONTRACT.AAVE_STAKER.ABI,
        key: StakerKey.AAVE_STAKER,
      },
      rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
    },
  },
  [config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS]: {
    name: "ETH-BTC Trend",
    description:
      "A long-only strategy for dynamic BTC-ETH portfolio management. A better way to hold while better managing the negative volatility.",
    strategyType: "Crypto portfolio",
    strategyTypeTooltip: "Cellar takes long positions in crypto",
    managementFee: "2%",
    managementFeeTooltip:
      "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
    protocols: "Uniswap V3",
    strategyAssets: ["BTC", "ETH", "USDC"],
    performanceSplit: {
      depositors: 90,
      protocol: 2.5,
      "strategy provider": 7.5,
    },
    strategyProvider: {
      logo: "/assets/images/clear-gate.png",
      title: "Clear Gate",
      href: "https://cleargate.capital/",
      tooltip:
        "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
    },
    strategyBreakdown: {
      goals: `ETH-BTC Trend strategy aims to provide a better risk-return tradeoff than holding ETH and/or BTC. The strategy follows upward price trends and exits the market when no positive trend is detected. The goal is to overperform simple buy and hold strategy, cut losses during market downturn, and re-establish the long position after prices start to go up, so that Sommelier users will not miss out any subsequent price appreciation.`,
      highlights: `The cellar:

      - Holds a combination of BTC and ETH with smart rebalancing depending on market conditions

      - High exposure to BTC and ETH when price trend goes up, no exposure when the trend is down

      - Risk management rules to reduce risks in unfavorable market`,
      description: `The cellar accumulates BTC and ETH relative to USDC with a medium to long-term perspective. The rebalancing decision applies the concept of trend following while also considering the correlation between the portfolio assets and emerging trends. The strategy aims to outperform the benchmarks and have lower volatility and risk than holding BTC or ETH individually or an equally weighted portfolio of BTC and ETH.

      The strategy is long only but cuts risk exposure when the price trends are negative. The cellar is based on backtests and is expected to outperform at times when price increases are moderate and to outperform significantly and reduce risks in a bear market. The strategy is likely to underperform in sideways markets or when prices are rising extremely quickly (because of being long only and not using leverage). The cellar is expected to capture the majority of any positive price trends, but it will always enter the market only after the trend has started to be positive. The strategy will limit losses if price movements are negative with the expectation of improving the risk-reward ratio. The benefits of the strategy can emerge within 3-6 month (i.e., medium term) holding period in case of diverse market conditions and are highly likely to emerge for holding periods over 1 year (i.e., long term).`,
      backtesting: `<img src="/assets/images/btc-eth-trend-backtesting.png" alt="btc eth trend backtesting" />
      Notes: Performance of the strategy from Jan 2019-Jun 2022. Black line for benchmark

      Backtest results:
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div>
          Period: Jan 2019 – June 2022
          APY: 123.72%
          Sharpe ratio: 2.117
          Profit-Loss Ratio: 0.94
          Worst drawdown: 28.50%
          Annual Std: 0.431
        </div>
        <div>
          Alpha: 0.868
          Cumulative profit: 1576.59%
          Win rate: 87%
          Loss rate: 13%
          Best month: 52.51%
          Worst month: -14.21%
        </div>
      </div>

      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.
      `,
    },
    overrideApy: {
      title: "Backtested APY",
      tooltip:
        "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
      value: "123.72%",
    },
    config: {
      id: config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS,
      lpToken: {
        address: config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS,
      },
      cellarRouter: {
        address: config.CONTRACT.CLEAR_GATE_ROUTER.ADDRESS,
        abi: config.CONTRACT.CLEAR_GATE_ROUTER.ABI,
        key: CellarRouterKey.CLEAR_GATE_ROUTER,
      },
      cellar: {
        address: config.CONTRACT.ETH_BTC_TREND_CELLAR.ADDRESS,
        abi: config.CONTRACT.ETH_BTC_TREND_CELLAR.ABI,
        key: CellarKey.CLEAR_GATE_CELLAR,
      },
    },
  },
  [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS]: {
    name: "ETH-BTC Momentum",
    description:
      "A dynamic long-only strategy for BTC-ETH portfolio management. More responsive to recent market changes and slightly more risky than BTC-ETH Trend strategy.",
    strategyType: "Crypto portfolio",
    strategyTypeTooltip: "Cellar takes long positions in crypto",
    managementFee: "2%",
    managementFeeTooltip:
      "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
    protocols: "Uniswap V3",
    strategyAssets: ["BTC", "ETH", "USDC"],
    performanceSplit: {
      depositors: 90,
      protocol: 2.5,
      "strategy provider": 7.5,
    },
    strategyProvider: {
      logo: "/assets/images/clear-gate.png",
      title: "Clear Gate",
      href: "https://cleargate.capital/",
      tooltip:
        "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
    },
    strategyBreakdown: {
      goals: `ETH-BTC Momentum strategy aims to provide a better risk-return tradeoff than holding ETH and/or BTC. The strategy reacts to positive price movement to buy ETH and/or BTC and decreases positions otherwise. The goal is to overperform simple buy-and-hold strategy, decrease losses during market downturn, and re-establish the long position after prices start to go up, so that Sommelier users will not miss out any subsequent price appreciation.`,

      highlights: `The cellar:

      - Holds a combination of BTC and ETH with smart rebalancing to suit market conditions

      - Has high exposure to BTC and ETH when price momentum is positive, low exposure when prices are dropping

      - Uses risk management rules to reduce risks in an unfavorable market`,
      description: `The cellar accumulates BTC and ETH relative to USDC with a medium to long-term perspective. The rebalancing decision is based on price momentum and the asset with higher momentum is assigned to be overweight. The strategy aims to outperform the benchmarks and have lower volatility and risk than holding BTC or ETH individually or in an equally weighted portfolio of BTC and ETH.

      The strategy is long only, but it reduces risk exposure if price momentum is negative. Backtests indicate the cellar will outperform at times when prices are rising moderately or one of the portfolio assets is appreciating faster than the other. The strategy is likely to underperform when there are extreme price appreciations but is expected to capture the majority of any positive price movements. The strategy is expected to outperform in a bear market since it can cut risk exposure, but it is exposed to negative price movements because it is long only and always holds at least a small proportion of risky assets. The benefits of the strategy should emerge within 3-6 month (i.e., medium term) holding period in case of diverse market conditions and are highly likely to emerge for holding periods over 1 year (i.e., long term).

      The strategy is more sensitive to positive market movements than a trend-following strategy and is expected to provide slightly higher returns in a bull market than a similar trend-following strategy but lower returns in a bear market.`,
      backtesting: `<img src="/assets/images/btc-eth-moment-backtesting.png" alt="btc eth moment backtesting" />
      Notes: Performance of the strategy from Jan 2019-Jun 2022. Black line for benchmark

      Backtest results:
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div>
          Period: Jan 2019 – June 2022
          APY: 84.15%
          Sharpe ratio: 1.402
          Profit-Loss Ratio: 1.76
          Worst drawdown: 60.30%
          Annual Std: 0.524
        </div>
        <div>
          Alpha: 0.671
          Cumulative profit: 748.12%
          Win rate: 62%
          Loss rate: 38%
          Best month: 51.97%
          Worst month: -27.50%
        </div>
      </div>
      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
    },
    overrideApy: {
      title: "Backtested APY",
      tooltip:
        "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
      value: "84.15%",
    },
    config: {
      id: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
      lpToken: {
        address: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
      },
      cellarRouter: {
        address: config.CONTRACT.CLEAR_GATE_ROUTER.ADDRESS,
        abi: config.CONTRACT.CLEAR_GATE_ROUTER.ABI,
        key: CellarRouterKey.CLEAR_GATE_ROUTER,
      },
      cellar: {
        address: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
        abi: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ABI,
        key: CellarKey.CLEAR_GATE_CELLAR,
      },
    },
  },
}
