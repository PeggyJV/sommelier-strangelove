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

export const ethBtcMomentum: CellarData = {
  name: "ETH-BTC Momentum",
  cellarType: CellarType.automatedPortfolio,
  slug: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG,
  dashboard:
    "https://debank.com/profile/0x6E2dAc3b9E9ADc0CbbaE2D0B9Fd81952a8D33872",
  launchDate: new Date("2022-10-28T00:00:00.000Z"),
  description:
    "Strategy portfolio has exposure to BTC and ETH with positive price momentum, lower exposure when prices drop.",
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: "Uniswap V3",
  strategyAssets: ["WBTC", "WETH", "USDC"],
  performanceSplit: {
    depositors: 90,
    "strategy provider": 7.5,
    protocol: 2.5,
  },
  strategyProvider: {
    logo: "/assets/images/clear-gate.png",
    title: "ClearGate",
    href: "https://cleargate.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `ETH-BTC Momentum strategy aims to provide a better risk-return tradeoff than holding ETH and/or BTC. The strategy reacts to positive price movement to buy ETH and/or BTC and decreases positions otherwise. The goal is to overperform simple buy-and-hold strategy, decrease losses during market downturn, and re-establish the long position after prices start to go up, so that Sommelier users will not miss out any subsequent price appreciation.`,

    highlights: `The vault:

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
  depositTokens: {
    list: ["WBTC", "WETH", ...depositAssetTokenList],
  },
  config: {
    id: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
    cellarNameKey: CellarNameKey.ETH_BTC_MOM,
    lpToken: {
      address: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
      imagePath: "/assets/icons/eth-btc-mom.svg",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ADDRESS,
      abi: config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.ABI,
      key: CellarKey.CELLAR_V0816,
    },
    staker: {
      address: config.CONTRACT.ETH_BTC_MOMENTUM_STAKER.ADDRESS,
      abi: config.CONTRACT.ETH_BTC_MOMENTUM_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
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
        "All rebalancing decisions are based on quantitative rules that are developed from historical price movements. The rules are dynamic and can change as market conditions change. The strategy gets information about price movements and market conditions from a range of quantitative metrics. Humans run the backtests and use simulation models and data science methods to develop the rules, but the rebalancing decision is made automatically by the computer following the quantitative rules that have been set for it.",
    },
    {
      question: "What is the portfolio composition?",
      answer: `The portfolio holds BTC, ETH and USDC as a market-neutral asset in proportions set by the quantitative rules. Those three assets can be held in any combination, so the strategy can hold 80% risky assets with 40% BTC and 40% ETH and 20% cash-like assets in USDC, or could have nearly 100% risky assets. The strategy will hold at least a small proportion of risky assets at all times. This makes the strategy more sensitive to positive price movements and captures more profits when prices go up. However, it also makes the strategy more prone to risk when prices go down as it never cuts the proportion of risky assets to zero.
        <br/><br/>
        The strategy evaluates market conditions in probabilities and makes rebalancing decisions accordingly. The proportions of BTC and ETH depend on which asset is deemed to have the higher upside probability at the time. This means a 50/50 split between BTC and ETH is possible but 60/40 or 80/20 splits might be equally likely. Neither BTC nor ETH is favored over the other but quantitative measurements determine which will become overweight when necessary.`,
    },
    {
      question: "How often is the portfolio rebalanced?",
      answer:
        "The portfolio is rebalanced a maximum of once or twice a week. The rebalancing frequency depends on quantitatively measured market conditions and price movements. The portfolio is not expected to trade or rebalance all the time, but only when market conditions dictate. Rebalancing a maximum twice a week means that the cellar is not likely to react quickly to either positive or negative price movements. Backtesting shows that rebalancing more frequently does not have meaningful positive benefit for the strategy. As crypto prices are very volatile, reacting quickly to abrupt price movements is likely to introduce noise and could make the portfolio miss the subsequent price recovery more often than necessary. This is why the portfolio is not rebalanced more often than once or twice a week.",
    },
    {
      question: "Does the cellar help to cut my losses?",
      answer:
        "The strategy uses risk management rules to reduce risk exposure if the market conditions are unfavorable. The strategy does not guarantee that losses will be cut and it is not able to react quickly to extreme news because of its rebalancing frequency. The risk management rules are designed to offer attractive risk-return characteristics and not necessarily to allow market exit when negative news emerges. The strategy is long only, which means that it will gain value only when asset prices go up. In short, the strategy has to take risk to make profit but it aims to keep profits larger than losses by applying risk management rules. The strategy will always hold at least a small proportion of risky assets and will depreciate in value when asset prices go down.",
    },
    {
      question: "Does the strategy work in all market conditions?",
      answer:
        "The strategy is long only and makes profits only when prices go up. Prices rarely go straight up and as long as price trends emerge, the strategy should be profitable and backtests show it should outperform BTC and ETH. When prices go down, the strategy should once again outperform BTC and ETH as it will reduce market exposure at that time. Unfortunately this does not mean that the strategy will make a profit when BTC and ETH prices go down and it might still lose value, but it is designed to lose significantly less than would be lost by holding spot BTC or ETH in a bear market. The strategy can be used to get into the market when prices start to recover after the bear market. The strategy will have no exposure or significantly reduced market exposure when the market is falling but it will take on market exposure when meaningful positive price movements are detected again. The strategy is expected to lose value when the market zig-zags within a narrow range.",
    },
    {
      question: "When should the strategy be used?",
      answer:
        "The strategy is designed to offer significantly better risk-return characteristics than holding spot positions in BTC or ETH or in an equal combination of them. The positive effects emerge over a longer time period that includes both positive and negative price movements. The strategy will not capture all of the positive price movements but is designed to capture the majority of them and reduce volatility at the same time. The strategy offers those wanting to hold BTC and ETH for a longer time some potentially attractive risk and return characteristics. It can also offer managed market timing for entering the market and applies risk management rules.",
    },
    {
      question: "What do the backtesting statistics mean?",
      answer: `The backtesting statistics can help to compare strategies and can give insights into the risk and return characteristics of the strategy. Such a comparison is only meaningful when the same time or observation period and the same calculation logic and benchmarks are used. The backtesting results are based on historical data and do not guarantee similar results in the future.
      <br/><br/>
      <ul>
        <li>APY: is the annualized percentage yield, which shows the average return per year</li>
        <li>Sharpe ratio: measures the risk adjusted relative performance of the portfolio. A higher Sharpe ratio indicates that the portfolio is able to perform better for each unit of risk taken.</li>
        <li>Profit-loss ratio: gives insights into the profitable and losing trades the strategy generates. It is calculated by taking the average profit from all the winning trades and dividing it by the average losses on all the losing trades.</li>
        <li>Worst drawdown: shows the largest price drop as a percentage from peak to trough, and is an indicator of downside risk.</li>
        <li>Annual std: annual standard deviation is a measure of risk showing the annualized volatility of the portfolio. A higher standard deviation indicates higher volatility or risk.</li>
        <li>Alpha: indicates the strategy’s ability to beat the benchmark in its risk adjusted returns. Positive alpha indicates it is outperforming the benchmark, while negative alpha indicates underperformance.</li>
        <li>Cumulative profit: shows the total profit from the strategy from its inception until the end of the backtesting period. To give a better comparison, the cumulative profit should be annualized if the observation period is longer than a year.</li>
        <li>Win rate: shows the proportion of winning trades in all trades during the observation period.</li>
        <li>Loss rate: shows the proportion of losing trades in all trades during the observation period.</li>
        <li>Best month: shows the return of the portfolio during the best month in the observation period.</li>
        <li>Worst month: shows the return of the portfolio during the worst month in the observation period and can be considered one indicator of downside risk.</li>
      </ul>
     <br/>

      Please remember that past performance is not indicative of future results. The backtesting procedure for the Cleargate strategies has followed all the best practices of backtesting to reduce the risks of over-optimising the strategies and takes account of actual trade execution costs and slippage.
      `,
    },
  ],
}
