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
    alternativeTo: "Holding ETH or BTC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: "https://app.uniswap.org/#/swap?outputCurrency=0x6b7f87279982d919Bbf85182DDeAB179B366D8f2",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
      {
        url: "https://helixapp.com/spot/ethbtctrend-usdt/",
        name: "Helix",
        logo: "/assets/icons/helix.png",
      },
    ],
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
    alternativeTo: "Holding ETH or BTC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: "https://app.uniswap.org/#/swap?outputCurrency=0x6E2dAc3b9E9ADc0CbbaE2D0B9Fd81952a8D33872",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
    ],
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
  [config.CONTRACT.STEADY_ETH.SLUG]: {
    name: "Steady ETH",
    provider: "Patache",
    providerUrl: "https://www.algoreturns.com/patache/",
    description: `Capture the upside of ETH price breakouts, manage downside through trailing stops. “Risk first” approach - capital preservation is prioritized over capital growth.`,
    ticker: (
      <>
        <Image
          alt="steady eth icon"
          src="/assets/icons/steady-eth.png"
          boxSize={8}
        />
        <Text>SteadyETH</Text>
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
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: "https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x3f07a84ecdf494310d397d24c1c78b041d2fa622",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
      {
        url: "https://helixapp.com/spot/steadyeth-usdt/",
        name: "Helix",
        logo: "/assets/icons/helix.png",
      },
    ],
    strategyHighlights: {
      card: [
        `“Risk first” approach - capital preservation is prioritized over capital growth.`,
        `Always defined risk for every position prevailing from trade inception until trade exit.`,
        `Each trade strategy comprises two independent trade orders: 1 "Workhorse" with a fixed target and stop + 1 "Racehorse" with a trailing stop.`,
      ],
      description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is prioritized over capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home
      <br/><br/>
      The trade management technique of ETH Breakout strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.
      <br/><br/>
      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed for the Cellar participant to remain committed over a medium to long term time frame (6 months to a year). In this time the benefits of being in the strategy are expected to emerge."`,
    },
    howItWorks: `Every recommended trade always sets the trade risk immediately after the position is activated. The level of risk is determined by our proprietary algorithms and is optimized for modest risk tolerance. It is important to emphasize that having a risk limit does not imply a guaranteed risk price, as slippage can be exacerbated in uncertain market conditions. With the downside risk under pragmatic control, the strategy can shift focus to the realization of upside potential. The upside potential comprises two parts – a fixed target and a variable target. A fixed target is a reasonable expectation of modest favorable market movement, and a variable target is deliberately open-ended to facilitate the pursuit of an opportunistic movement in favor of the trade. The pursuit of a variable target is activated when the initial capital outlay for the trade has already been earned back and realized, thereby adding no incremental risk to the position.
    <br/><br/>
    With the visibility of the trade risk, the investor can focus on the capital-at-risk/risk appetite. Our approach towards capital management is prudence accompanied by a strategy to “stay in the game.” We recommend a capital allocation of 2.5%-5.0% per trade, which allows the investor to stay with the strategy for 40-20 consecutive losing trades. Of course, the actual risk tolerance of investors is on a broad spectrum, and some investors may even be comfortable with a 10-15% allocation per trade.
    <br/><br/>
    The trade management technique comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Capital allocation of 2.50% per trade strategy assigned equally to “Workhorse” and “Racehorse” (1.25% each).
    <br/><br/>
    ETH Long Trade example: A long trade is triggered when the market reaches the directional entry level. 2 positions on the long side are initiated by accumulating the ETH relative to USDC. Each position is immediately assigned a Target and a Stop (loss). If the market reaches the Target before the Stop, the workhorse BTC is sold for USDC, profit taken. Simultaneously, the racehorse Stop changes to a Trailing stop. At this point, the economic risk is nullified, a small profit is locked in, and the racehorse is pursuing a larger payoff potential.
    <br/><br/>
    Disclaimer: Simplified for narrative purposes. Actual algorithm(s) may vary.
    `,
    // backtestingImage: "/assets/images/btc-eth-moment-backtesting.png",
    backtestingText: `
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div style="width:50%">
          Beginning Cellar Value: 500,000
          Period: May 2021 - September 2022
          No. of Trades: 72
          Worst Loss (Single Trade): -6,838
          Worst drawdown:  7.55%
          Annualized Sharpe Ratio: 267%
          Annualized Std.Dev of Return: 10.4%
        </div>
        <div style="width:50%">
          Annualized Mean Return: 27.8%
          Cumulative profit: 46.6%
          Win rate: 55%
          Loss rate: 45%
          Best month: 8%
          Worst month: -2.5%
        </div>
      </div>
      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
  },
  [config.CONTRACT.STEADY_BTC.SLUG]: {
    name: "Steady BTC",
    provider: "Patache",
    providerUrl: "https://www.algoreturns.com/patache/",
    description: `Capture the upside of BTC price breakouts, manage downside through trailing stops. “Risk first” approach - capital preservation is prioritized over capital growth.`,
    ticker: (
      <>
        <Image
          alt="steady btc icon"
          src="/assets/icons/steady-btc.png"
          boxSize={8}
        />
        <Text>SteadyBTC</Text>
      </>
    ),
    tradedAssets: (
      <>
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
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: " https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x4986fd36b6b16f49b43282ee2e24c5cf90ed166d",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
      {
        url: "https://helixapp.com/spot/steadybtc-usdt/",
        name: "Helix",
        logo: "/assets/icons/helix.png",
      },
    ],
    strategyHighlights: {
      card: [
        `“Risk first” approach - capital preservation is prioritized over capital growth.`,
        `Always defined risk for every position prevailing from trade inception until trade exit.`,
        `Each trade strategy comprises two independent trade orders: 1 "Workhorse" with a fixed target and stop + 1 "Racehorse" with a trailing stop.`,
      ],
      description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is prioritized over capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."
      <br/><br/>
      The trade management technique of BTC Breakout strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.
      <br/><br/>
      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed for the Cellar participant to remain committed over a medium to long term time frame (6 months to a year). In this time the benefits of being in the strategy are expected to emerge."

      `,
    },
    howItWorks: `Every recommended trade always sets the trade risk immediately after the position is activated. The level of risk is determined by our proprietary algorithms and is optimized for modest risk tolerance. It is important to emphasize that having a risk limit does not imply a guaranteed risk price, as slippage can be exacerbated in uncertain market conditions. With the downside risk under pragmatic control, the strategy can shift focus to the realization of upside potential. The upside potential comprises two parts – a fixed target and a variable target. A fixed target is a reasonable expectation of modest favorable market movement, and a variable target is deliberately open-ended to facilitate the pursuit of an opportunistic movement in favor of the trade. The pursuit of a variable target is activated when the initial capital outlay for the trade has already been earned back and realized, thereby adding no incremental risk to the position.
    <br/><br/>
    With the visibility of the trade risk, the investor can focus on the capital-at-risk/risk appetite. Our approach towards capital management is prudence accompanied by a strategy to “stay in the game.” We recommend a capital allocation of 2.5%-5.0% per trade, which allows the investor to stay with the strategy for 40-20 consecutive losing trades. Of course, the actual risk tolerance of investors is on a broad spectrum, and some investors may even be comfortable with a 10-15% allocation per trade.
    <br/><br/>
    The trade management technique comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Capital allocation of 2.50% per trade strategy assigned equally to “Workhorse” and “Racehorse” (1.25% each).
    <br/><br/>
    BTC Long Trade example: A long trade is triggered when the market reaches the directional entry level. 2 positions on the long side are initiated by accumulating the BTC relative to USDC. Each position is immediately assigned a Target and a Stop (loss). If the market reaches the Target before the Stop, the workhorse BTC is sold for USDC, profit taken. Simultaneously, the racehorse Stop changes to a Trailing stop. At this point, the economic risk is nullified, a small profit is locked in, and the racehorse is pursuing a larger payoff potential.
    <br/><br/>
    Disclaimer: Simplified for narrative purposes. Actual algorithm(s) may vary.
    `,
    // backtestingImage: "/assets/images/btc-eth-moment-backtesting.png",
    backtestingText: `
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
  [config.CONTRACT.STEADY_UNI.SLUG]: {
    name: "Steady UNI",
    provider: "Patache",
    providerUrl: "https://www.algoreturns.com/patache/",
    description: `Capture the upside of UNI price breakouts, manage downside through trailing stops. "Risk first" approach - capital preservation is prioritized over capital growth.`,
    ticker: (
      <>
        <Image
          alt="steady uni icon"
          src="/assets/icons/steady-uni.png"
          boxSize={8}
        />
        <Text>SteadyUNI</Text>
      </>
    ),
    tradedAssets: (
      <>
        <Image
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
        <Image
          alt="uniswap icon"
          src="/assets/icons/uniswap.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: " https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x6f069f711281618467dae7873541ecc082761b33",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
      // {
      //   url: "https://helixapp.com/spot/steadybtc-usdt/",
      //   name: "Helix",
      //   logo: "/assets/icons/helix.png",
      // },
    ],
    strategyHighlights: {
      card: [
        `“Risk first” approach - capital preservation is prioritized over capital growth.`,
        `Always defined risk for every position prevailing from trade inception until trade exit. Increased risk profile for Steady UNI/MATIC strategies vs Steady ETH or Steady BTC.`,
        `Each trade strategy comprises two independent trade orders: 1 "Workhorse"  with a fixed target to lock in some return and stop + 1 "Racehorse" with a trailing stop to capture market upside.`,
      ],
      description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is prioritized over capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."
      <br/><br/>
      The trade management technique of Steady UNI strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.
      <br/><br/>
      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed for the Cellar participant to remain committed over a medium to long term time frame (6 months to a year). In this time the benefits of being in the strategy are expected to emerge.`,
    },
    howItWorks: `Every recommended trade always sets the trade risk immediately after the position is activated. The level of risk is determined by our proprietary algorithms and is optimized for modest risk tolerance. It is important to emphasize that having a risk limit does not imply a guaranteed risk price, as slippage can be exacerbated in uncertain market conditions. With the downside risk under pragmatic control, the strategy can shift focus to the realization of upside potential. The upside potential comprises two parts – a fixed target and a variable target. A fixed target is a reasonable expectation of modest favorable market movement, and a variable target is deliberately open-ended to facilitate the pursuit of an opportunistic movement in favor of the trade. The pursuit of a variable target is activated when the initial capital outlay for the trade has already been earned back and realized, thereby adding no incremental risk to the position.
    <br/><br/>
    With the visibility of the trade risk, the investor can focus on the capital-at-risk/risk appetite. Our approach towards capital management is prudence accompanied by a strategy to “stay in the game.” We recommend a capital allocation of 2.5%-5.0% per trade, which allows the investor to stay with the strategy for 40-20 consecutive losing trades. Of course, the actual risk tolerance of investors is on a broad spectrum, and some investors may even be comfortable with a 10-15% allocation per trade.
    <br/><br/>
    The trade management technique comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Capital allocation of 2.50% per trade strategy assigned equally to “Workhorse” and “Racehorse” (1.25% each).
    <br/><br/>
    UNI Long Trade example: A long trade is triggered when the market reaches the directional entry level. 2 positions on the long side are initiated by accumulating the UNI relative to USDC. Each position is immediately assigned a Target and a Stop (loss). If the market reaches the Target before the Stop, the workhorse UNI is sold for USDC, profit taken. Simultaneously, the racehorse Stop changes to a Trailing stop. At this point, the economic risk is nullified, a small profit is locked in, and the racehorse is pursuing a larger payoff potential.
    <br/><br/>
    Disclaimer: Simplified for narrative purposes. Actual algorithm(s) may vary.
    `,
    backtestingText: `
    Risk level 3%
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div style="width:50%">
          Beginning Cellar Value: 100,000
          Period: Feb 2022 - December 2022
          No. of Trades: 43
          Worst Loss (Single Trade): -1,947
          Worst drawdown: 5.60%
          Annualized Sharpe Ratio: N/A
          Annualized Std.Dev of Return: N/A
        </div>
        <div style="width:50%">
          Annualized Mean Return: 6.40%
          Cumulative profit: 5.00%
          Win rate: 51%
          Loss rate: 49%
          Best month: 6.70%
          Worst month: -4.47%
        </div>
      </div>

    Risk level 6%
    <div style="display:flex;flex-direction:row;gap:5rem;">
      <div style="width:50%">
        Beginning Cellar Value: 100,000
        Period: Feb 2022 - December 2022
        No. of Trades: 43
        Worst Loss (Single Trade): -3,935
        Worst drawdown:  8.00%
        Annualized Sharpe Ratio: N/A
        Annualized Std.Dev of Return: N/A
      </div>
      <div style="width:50%">
        Annualized Mean Return: 17.00%
        Cumulative profit: 13.40%
        Win rate: 51%
        Loss rate: 49%
        Best month: 14.31%
        Worst month: -6.38%
      </div>
    </div>
      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
  },
  [config.CONTRACT.STEADY_MATIC.SLUG]: {
    name: "Steady MATIC",
    provider: "Patache",
    providerUrl: "https://www.algoreturns.com/patache/",
    description: `Capture the upside of MATIC price breakouts, manage downside through trailing stops. "Risk first" approach - capital preservation is prioritized over capital growth.`,
    ticker: (
      <>
        <Image
          alt="steady matic icon"
          src="/assets/icons/steady-matic.png"
          boxSize={8}
        />
        <Text>SteadyMATIC</Text>
      </>
    ),
    tradedAssets: (
      <>
        <Image
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
        <Image
          alt="matic icon"
          src="/assets/icons/matic.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        url: " https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x05641a27c82799aaf22b436f20a3110410f29652",
        name: "Uniswap",
        logo: "/assets/icons/uniswap.png",
      },
      // {
      //   url: "https://helixapp.com/spot/steadybtc-usdt/",
      //   name: "Helix",
      //   logo: "/assets/icons/helix.png",
      // },
    ],
    strategyHighlights: {
      card: [
        `“Risk first” approach - capital preservation is prioritized over capital growth.`,
        `Always defined risk for every position prevailing from trade inception until trade exit. Increased risk profile for Steady UNI/MATIC strategies vs Steady ETH or Steady BTC.`,
        `Each trade strategy comprises two independent trade orders: 1 "Workhorse"  with a fixed target to lock in some return and stop + 1 "Racehorse" with a trailing stop to capture market upside.`,
      ],
      description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is prioritized over capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."
      <br/><br/>
      The trade management technique of Steady MATIC strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.
      <br/><br/>
      The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed for the Cellar participant to remain committed over a medium to long term time frame (6 months to a year). In this time the benefits of being in the strategy are expected to emerge.`,
    },
    howItWorks: `Every recommended trade always sets the trade risk immediately after the position is activated. The level of risk is determined by our proprietary algorithms and is optimized for modest risk tolerance. It is important to emphasize that having a risk limit does not imply a guaranteed risk price, as slippage can be exacerbated in uncertain market conditions. With the downside risk under pragmatic control, the strategy can shift focus to the realization of upside potential. The upside potential comprises two parts – a fixed target and a variable target. A fixed target is a reasonable expectation of modest favorable market movement, and a variable target is deliberately open-ended to facilitate the pursuit of an opportunistic movement in favor of the trade. The pursuit of a variable target is activated when the initial capital outlay for the trade has already been earned back and realized, thereby adding no incremental risk to the position.
    <br/><br/>
    With the visibility of the trade risk, the investor can focus on the capital-at-risk/risk appetite. Our approach towards capital management is prudence accompanied by a strategy to “stay in the game.” We recommend a capital allocation of 2.5%-5.0% per trade, which allows the investor to stay with the strategy for 40-20 consecutive losing trades. Of course, the actual risk tolerance of investors is on a broad spectrum, and some investors may even be comfortable with a 10-15% allocation per trade.
    <br/><br/>
    The trade management technique comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Capital allocation of 2.50% per trade strategy assigned equally to “Workhorse” and “Racehorse” (1.25% each).
    <br/><br/>
    MATIC Long Trade example: A long trade is triggered when the market reaches the directional entry level. 2 positions on the long side are initiated by accumulating the MATIC relative to USDC. Each position is immediately assigned a Target and a Stop (loss). If the market reaches the Target before the Stop, the workhorse MATIC is sold for USDC, profit taken. Simultaneously, the racehorse Stop changes to a Trailing stop. At this point, the economic risk is nullified, a small profit is locked in, and the racehorse is pursuing a larger payoff potential.
    <br/><br/>
    Disclaimer: Simplified for narrative purposes. Actual algorithm(s) may vary.`,
    backtestingText: `
    Risk level 3%
      <div style="display:flex;flex-direction:row;gap:5rem;">
        <div style="width:50%">
          Beginning Cellar Value: 100,000
          Period: Feb 2022 - December 2022
          No. of Trades: 25
          Worst Loss (Single Trade): -1,809
          Worst drawdown: 2.70%
          Annualized Sharpe Ratio: N/A
          Annualized Std.Dev of Return: N/A
        </div>
        <div style="width:50%">
          Annualized Mean Return: 5.86%
          Cumulative profit: 5.30%
          Win rate: 68%
          Loss rate: 32%
          Best month: 4.25%
          Worst month: -1.80%
        </div>
      </div>

    Risk level 6%
    <div style="display:flex;flex-direction:row;gap:5rem;">
      <div style="width:50%">
        Beginning Cellar Value: 100,000
        Period: Feb 2022 - December 2022
        No. of Trades: 25
        Worst Loss (Single Trade): -2,910
        Worst drawdown:  3.10%
        Annualized Sharpe Ratio: N/A
        Annualized Std.Dev of Return: N/A
      </div>
      <div style="width:50%">
        Annualized Mean Return: 11.00%
        Cumulative profit: 10.14%
        Win rate: 68%
        Loss rate: 32%
        Best month: 4.25%
        Worst month: -1.80%
      </div>
    </div>
      Presented results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions.`,
  },
  [config.CONTRACT.REAL_YIELD_USD.SLUG]: {
    name: "Real Yield USD",
    provider: "Seven Seas",
    providerUrl: "https://www.algoreturns.com/patache/",
    description: `The only strategy in Defi to maximize USDC, USDT, and DAI yields across Aave, Compound and Uniswap V3.`,
    ticker: (
      <>
        <Image
          alt="real yield usd icon"
          src="/assets/icons/real-yield-usd.png"
          boxSize={8}
        />
        <Text>YieldUSD</Text>
      </>
    ),
    tradedAssets: (
      <>
        <Image
          alt="usdc icon"
          src="/assets/icons/usdc.png"
          boxSize={8}
        />
        <Image
          alt="usdt icon"
          src="/assets/icons/usdt.png"
          boxSize={8}
        />
        <Image
          alt="dai icon"
          src="/assets/icons/dai.png"
          boxSize={8}
        />
      </>
    ),
    alternativeTo:
      "Holding or manually lending / LPing USDC, USDT, and DAI",

    strategyHighlights: {
      card: [
        `The only active strategy which optimally allocates capital across key protocols for max yield.`,
        `Combines lending and LPing activities in a single strategy to deliver real yield others can't.`,
        `Optimizes Uniswap V3 LP tick ranges.`,
      ],
      description: `"Real Yield USD has a real technological edge to deliver yields others can't.

      By “real yield” we mean yield that results from trading or lending activity (fees) rather than resulting from incentives. The primary sources of real yield exist on lending platforms like Aave and Compound, and decentralized exchanges like Uniswap. Because of this, Real Yield USD focuses on these three protocols and simultaneously allocates capital to Aave and Compound lending pools and Uniswap V3 LP pools in order to maximize yield.

      One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can manage the complexity of optimizing Uniswap V3 tick ranges. Many other yield strategies can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing strategies."`,
    },
    howItWorks: `Determining the optimal allocation of stablecoins across these three protocols for the highest yield is non-trivial and requires off-chain computation.
    <br/><br/>
    Sommelier’s novel infrastructure enables active capital management of an ERC-4626 vault (guided by off-chain computation) while remaining non-custodial, transparent, and decentralized. The optimal allocation is determined by a numerical optimization procedure that accounts for swap fees and market impact due to position size, and makes use of various simple time-series forecasting methods to estimate (future) base yields.
    <br/><br/>
    One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it optimizes Uniswap V3 tick ranges. Picking a lending position on Aave or Compound is relatively easy (ignoring factors like market impact which are actually important) because there are no degrees of freedom - it simply boils down to the decision of whether to lend a certain token or not. Providing liquidity on Uniswap V3, on the other hand, is complex because the choice of tick range determines both fee revenue and impermanent loss. Our optimization procedure accounts for all of these factors.`,
    backtestingText: `
        <img src="/assets/images/real-yield-usd-backtesting-image.png"/>
      `,
  },
}
