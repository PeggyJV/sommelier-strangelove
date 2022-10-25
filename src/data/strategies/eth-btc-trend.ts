import { config } from "utils/config"
import { CellarKey, CellarRouterKey } from "../types"

export const ethBtcTrend = {
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
}
