import { config } from "utils/config"
import { CellarKey, CellarRouterKey } from "../types"

export const ethBtcMomentum = {
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
}
