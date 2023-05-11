// TODO: Move content to a cms
import { Image, Text } from "@chakra-ui/react"
import { config } from "utils/config"

export const strategyPageContentData = {
  [config.CONTRACT.ETH_BTC_TREND_CELLAR.SLUG]: {
    name: "ETH-BTC Trend Strategy",
    provider: "ClearGate",
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
    tradedAssets: ["USDC", "WETH", "WBTC"],
    alternativeTo: "Holding ETH or BTC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        name: "Rhino ( L2 deposit option )",
        logo: "/assets/icons/rhino-fi.svg",
        url: "https://app.rhino.fi/strategy/ETHBTCTREND",
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
    provider: "ClearGate",
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
    tradedAssets: ["USDC", "WETH", "WBTC"],
    alternativeTo: "Holding ETH or BTC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        name: "Rhino ( L2 deposit option )",
        logo: "/assets/icons/rhino-fi.svg",
        url: "https://app.rhino.fi/strategy/ETHBTCMOMENTUM",
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
    tradedAssets: ["WETH", "USDC"],
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
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
    tradedAssets: ["WBTC", "USDC"],
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
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
    tradedAssets: ["USDC", "UNI"],
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
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
    tradedAssets: ["USDC", "MATIC"],
    alternativeTo: "Holding USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
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
    providerUrl: "https://7seas.capital/",
    description: `The only strategy in Defi to maximize USDC, USDT, and DAI yields across Aave, Compound and Uniswap V3.`,
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        name: "Rhino ( L2 deposit option )",
        logo: "/assets/icons/rhino-fi.svg",
        url: "https://app.rhino.fi/invest/YIELDUSD/supply",
      },
    ],
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
    tradedAssets: ["USDC", "USDT", "DAI"],
    alternativeTo:
      "Holding or manually lending / LPing USDC, USDT, and DAI",

    strategyHighlights: {
      card: [
        `The only active strategy which optimally allocates capital across key protocols for max yield.`,
        `Combines lending and LPing activities in a single strategy to deliver real yield others can't.`,
        `Optimizes Uniswap V3 LP tick ranges.`,
      ],
      description: `Real Yield USD has a real technological edge to deliver yields others can't.
      <br/><br/>
      By “real yield” we mean yield that results from trading or lending activity (fees) rather than resulting from incentives. The primary sources of real yield exist on lending platforms like Aave and Compound, and decentralized exchanges like Uniswap. Because of this, Real Yield USD focuses on these three protocols and simultaneously allocates capital to Aave and Compound lending pools and Uniswap V3 LP pools in order to maximize yield.
      <br/><br/>
      One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can actively optimize Uniswap V3 tick ranges. Many other yield strategies can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing strategies.`,
    },
    howItWorks: `Determining the optimal allocation of stablecoins across these three protocols for the highest yield is non-trivial and requires off-chain computation.
    <br/><br/>
    Sommelier's novel infrastructure enables active optimization of capital of an erc-4626 vault (guided by off-chain computation) while remaining non-custodial, transparent, and decentralized. The optimal allocation is determined by a numerical optimization procedure that accounts for swap fees and market impact due to position size, and makes use of various simple time-series forecasting methods to estimate (future) base yields.
    <br/><br/>
    One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it optimizes Uniswap V3 tick ranges. Picking a lending position on Aave or Compound is relatively easy (ignoring factors like market impact which are actually important) because there are no degrees of freedom - it simply boils down to the decision of whether to lend a certain token or not. Providing liquidity on Uniswap V3, on the other hand, is complex because the choice of tick range determines both fee revenue and impermanent loss. Our optimization procedure accounts for all of these factors.`,
    backtestingText: `
        <img src="/assets/images/real-yield-usd-backtesting-image.jpg"/>
      `,
  },
  [config.CONTRACT.REAL_YIELD_ETH.SLUG]: {
    name: "Real Yield ETH",
    provider: "Seven Seas & DeFine Logic Labs",
    providerUrl: "https://7seas.capital/",
    description: `Maximize ETH yield through Aave and Compound leveraged staking and Uniswap V3 liquidity provision of ETH liquid staking tokens.`,
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
      {
        name: "Rhino ( L2 deposit option )",
        logo: "/assets/icons/rhino-fi.svg",
        url: "https://app.rhino.fi/invest/YIELDETH/supply",
      },
    ],
    ticker: (
      <>
        <Image
          alt="real yield eth icon"
          src="/assets/icons/real-yield-eth.png"
          boxSize={8}
        />
        <Text>YieldETH</Text>
      </>
    ),
    tradedAssets: ["stETH", "cbETH", "rETH", "WETH"],
    alternativeTo: "Lending or LPing ETH LSTs",

    strategyHighlights: {
      card: [
        `Accumulates leverage using a method that is highly capital efficient and significantly reduces gas and flash loan fees.`,
        `Dynamically allocates capital across key protocols for best-in-class yield.`,
        `Optimizes Uniswap V3 tick ranges.`,
      ],
      description: `Liquid Staked Tokens (LSTs) have gained significant traction since Ethereum's transition to proof-of-stake by allowing users to earn staking yield while also using that capital within DeFi, resolving the tension between securing the network and accessing liquidity to pursue DeFi opportunities. The innovations from liquid staking providers like Lido and RocketPool have seen LSTs become a growing component of Ethereum DeFi, and Real Yield ETH is poised to be a powerful vault for capturing organic yield across prominent LSTs.
      <br/><br/>
      Note that Real Yield ETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
      `,
    },
    howItWorks: `The vault will initially generate yield using two primary techniques, but has the ability to integrate with other protocols for new capabilities in the future. The techniques initially used in the vault:
    <br/><br/>
    1. Leveraged Staking: This method involves a continuous cycle of exchanging ETH for an ETH denominated LST, utilizing the LST as collateral on Aave or Compound, borrowing more ETH, and repeating the cycle. This process is commonly referred to as “looping.”
    <br/><br/>
    2. Liquidity Provisioning: This approach involves providing liquidity to ETH/ ETH denominated LST trading pairs on Uniswap V3. As a liquidity provider (LP), the vault deposits both ETH and an LST into a liquidity pool, earning fees from traders who swap between the two tokens.
    <br/><br/>
    Sommelier’s novel architecture gives the vault advanced capabilities when it comes to both leveraged staking and liquidity provision strategies. More specifically, for leveraged staking, the vault uses a sophisticated solution to accumulate leverage that is highly capital efficient and significantly reduces gas and flash loan fees frequently associated with typical leverage practices. While the vault is leveraged, its smart contract enforces a minimum 1.05 health factor during each rebalance as a safety precaution and the vault closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.
    <br/><br/>
    For the liquidity provision strategies, the vault’s ability to run off-chain computation combined with Seven Seas’ deep Uniswap V3 experience, positions the vault to be a top performing LP in the pools that it utilizes. The vault will be able to dynamically adapt to changing price movements to quote the optimal tick range(s) that collect the most fees while minimizing impermanent loss.
    `,
  },
  [config.CONTRACT.DEFI_STARS.SLUG]: {
    name: "DeFi Stars",
    provider: "AlgoLab",
    providerUrl: "https://beta.algolab.ro/",
    description: `A long-only approach with established DeFi assets and derivatives tokens during the uptrend market periods. React quickly to market changes by managing downtrends.`,
    ticker: (
      <>
        <Image
          alt="defi stars icon"
          src="/assets/icons/defi-stars.png"
          boxSize={8}
        />
        <Text>STARS</Text>
      </>
    ),
    tradedAssets: ["COMP", "CRV", "LDO", "MKR", "AAVE", "USDC"],
    alternativeTo: "DPI",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Maximum capital growth preference, well suited for portfolios with an initial basket of MKR, AAVE, COMP, LDO, CRV, and USDC.`,
        `Carefully balanced asset allocation targets based on our custom trend indicator. Individual asset volatility and risk aversion management.`,
        `Automatic order size and execution frequency to improve trend reaction while reducing fees and slippage.`,
      ],
      description: `The vault provides users with a strategy to achieve strong growth in their portfolio by focusing only on high-cap assets that offer significant rewards in a future with simplified DeFi adoption. The vault's initial portfolio includes MKR, AAVE, COMP, LDO, CRV as speculative tokens and USDC as a base asset, with a default portfolio distribution of 50% USDC to reduce risk and capture later opportunities.
      <br/><br/>
      To evaluate the effectiveness of the proposed strategy, we compare the portfolio's performance against a benchmark scenario of holding assets with no stop plans for price. We evaluate the strategy using Return on Equity (ROE), Maximum Drawdown (MDD), and Sharpe ratio, which is a popular indicator for portfolio tracking.
      <br/><br/>
      Overall, DeFi Stars provides a disciplined and diversified exposure to the DeFi sector, helping users manage downside volatility and optimize returns over time. The rebalancing strategy offers a significant improvement over the benchmark scenario and can help users achieve their goals.`,
    },
    howItWorks: `Continuously monitoring high-cap DeFi assets and derivatives tokens for performance/capitalization changes allows us to obtain the best portfolio diversification for our strategy. Our strategy will have an initial best 5 assets and a stablecoin.
    <br/><br/>
    The vault reacts quickly to market changes by capturing upside breakouts and managing downtrends. It also utilizes a long-only approach in established DeFi assets during markup periods.
    <br/><br/>
    Our system is running parallel backtesting using machine learning algorithms to determine the most optimized parameters to use for the trend indicators, allocation range buffers, and dynamic stop loss.
    <br/><br/>
    Trend detection is based on a custom indicator set by optimized parameters. The trend is used to determine the direction for portfolio rebalancing for each asset.
    <br/><br/>
    Actual portfolio allocation will appear different than our targeted portfolio as a result of the rate of allocation over time. This rate of change is another optimized parameter from our previous step.
    <br/><br/>
    Gas fees will be inferred and monitored, and based on our current TVL, we will run periodic opportunistic decisions to decide if and when to execute rebalancing swaps transactions inside our vault.
    <br/><br/>
    Disclaimer: Simplified for narrative purposes. Actual algorithm(s) may vary.
    `,
  },
}
