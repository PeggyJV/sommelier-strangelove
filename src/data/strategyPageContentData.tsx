// TODO: Move content to a cms
import { Image, Text } from "@chakra-ui/react"
import { config } from "utils/config"

export const strategyPageContentData = {
  [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: {
    name: "ETH-BTC Trend Strategy",
    provider: "Cleargate Capital",
    providerUrl: "https://cleargate.capital/",
    description:
      "Strategy portfolio buys BTC and ETH when prices go up. Fully or partially sells both assets when prices go down.",
    ticker: (
      <>
        <Image
          alt="eth btc trend"
          src="/assets/icons/eth-btc-trend.svg"
          boxSize={8}
        />
        <Text>ETHBTCTrend</Text>
      </>
    ),
    tradedAssets: (
      <>
        <Image
          alt="eth icon"
          src="/assets/icons/eth.png"
          boxSize={8}
        />
        <Image
          alt="btc icon"
          src="/assets/icons/btc.png"
          boxSize={8}
        />
        <Image
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo: "Holding ETH or BTC",
    buyUrl:
      "https://app.uniswap.org/#/swap?outputCurrency=0x6b7f87279982d919Bbf85182DDeAB179B366D8f2",
    strategyHighlights: {
      card: [
        "Holds a combination of BTC and ETH with smart rebalancing depending on market conditions.",
        "Has high exposure to BTC and ETH when the price trend goes up, no exposure when the trend is down.",
        "Risk management rules to reduce risks in unfavorable market.",
      ],
      description:
        "ETH-BTC Trend strategy aims to provide a better risk-return tradeoff than holding ETH and/or BTC. The strategy follows upward price trends and exits the market when no positive trend is detected. The goal is to overperform simple buy and hold strategy, cut losses during market downturn, and re-establish the long position after prices start to go up, so that Sommelier users will not miss out any subsequent price appreciation.",
    },
    howItWorks:
      "The strategy accumulates BTC and ETH relative to USDC with a medium to long-term perspective. The rebalancing decision applies the concept of trend following while also considering the correlation between the portfolio assets and emerging trends. The strategy aims to outperform the benchmarks and have lower volatility and risk than holding BTC or ETH individually or an equally weighted portfolio of BTC and ETH.",
    backtestingImage: "/assets/images/btc-eth-trend-backtesting.png",
    backtestingText: `Notes: Performance of the strategy from Jan 2019-Jun 2022. Black line for benchmark

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

      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
  },
  [config.CONTRACT.ETH_BTC_MOMENTUM_CELLAR.SLUG]: {
    name: "ETH-BTC Momentum Strategy",
    provider: "Cleargate Capital",
    providerUrl: "https://cleargate.capital/",
    description:
      "Strategy portfolio has exposure to BTC and ETH with positive price momentum, lower exposure when prices drop.",
    ticker: (
      <>
        <Image
          alt="eth btc mom icon"
          src="/assets/icons/eth-btc-mom.svg"
          boxSize={8}
        />
        <Text>ETHBTCMom</Text>
      </>
    ),
    tradedAssets: (
      <>
        <Image
          alt="eth icon"
          src="/assets/icons/eth.png"
          boxSize={8}
        />
        <Image
          alt="btc icon"
          src="/assets/icons/btc.png"
          boxSize={8}
        />
        <Image
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo: "Holding ETH or BTC",
    buyUrl:
      "https://app.uniswap.org/#/swap?outputCurrency=0x6E2dAc3b9E9ADc0CbbaE2D0B9Fd81952a8D33872",
    strategyHighlights: {
      card: [
        "Holds a combination of BTC and ETH with smart rebalancing to suit market conditions.",
        "Has high exposure to BTC and ETH when the price trend goes up, no exposure when the trend is down.",
        "Uses risk management rules to reduce risks in unfavorable market conditions.",
      ],
    },
    howItWorks: `ETH-BTC Trend strategy aims to provide a better risk-return tradeoff than holding ETH and/or BTC. The cellar accumulates BTC and ETH relative to USDC with a medium to long-term perspective. The
    rebalancing decision is based on price momentum and the asset with higher momentum is assigned to be overweight. The strategy aims to outperform the benchmarks and have lower volatility and risk than holding BTC or ETH individually or in an equally weighted portfolio of BTC and ETH.
    <br/><br/>
    The strategy is long only, but it reduces risk exposure if price momentum is negative. Backtests indicate the cellar will outperform at times when prices are rising moderately or one of the portfolio assets is appreciating faster than the other. The strategy is likely to underperform when there are extreme price appreciations but is expected to capture the majority of any positive price movements. The strategy is expected to outperform in a bear market since it can cut risk exposure, but it is exposed to negative price movements because it is long only and always holds at least a small proportion of risky assets. The benefits of the strategy should emerge within 3-6 month (i.e., medium term) holding period in case of diverse market conditions and are highly likely to emerge for holding periods over 1 year (i.e., long term).
    <br/><br/>
    The strategy is more sensitive to positive market movements than a trend-following strategy and is expected to provide slightly higher returns in a bull market than a similar trend-following strategy but lower returns in a bear market.`,
    backtestingImage: "/assets/images/btc-eth-moment-backtesting.png",
    backtestingText: `Notes: Performance of the strategy from Jan 2019-Jun 2022. Black line for benchmark

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
}
