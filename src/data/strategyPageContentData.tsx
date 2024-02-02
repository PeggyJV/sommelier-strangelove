import { Image, Text } from "@chakra-ui/react"
// import { time } from "console"
// import { add } from "date-fns"
// import { be } from "date-fns/locale"
// import { on } from "events"
// import { at, some, take, each } from "lodash"
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
        `Always defined risk for every position prevailing from trade inception until trade exit. Increased risk profile for Steady UNI/MATIC vaults vs Steady ETH or Steady BTC.`,
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
        `Always defined risk for every position prevailing from trade inception until trade exit. Increased risk profile for Steady UNI/MATIC vaults vs Steady ETH or Steady BTC.`,
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
    description: `Maximize stablecoin yield across Aave, Compound, Uniswap, Morpho and the DAI Savings Rate.`,
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
      One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can actively optimize Uniswap V3 tick ranges. Many other yield vaults can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing vaults.`,
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
    provider: "Seven Seas",
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
    Sommelier’s novel architecture gives the vault advanced capabilities when it comes to both leveraged staking and liquidity provision vaults. More specifically, for leveraged staking, the vault uses a sophisticated solution to accumulate leverage that is highly capital efficient and significantly reduces gas and flash loan fees frequently associated with typical leverage practices. While the vault is leveraged, its smart contract enforces a minimum 1.05 health factor during each rebalance as a safety precaution and the vault closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.
    <br/><br/>
    For the liquidity provision vaults, the vault’s ability to run off-chain computation combined with Seven Seas’ deep Uniswap V3 experience, positions the vault to be a top performing LP in the pools that it utilizes. The vault will be able to dynamically adapt to changing price movements to quote the optimal tick range(s) that collect the most fees while minimizing impermanent loss.
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
  [config.CONTRACT.REAL_YIELD_LINK.SLUG]: {
    name: "Real Yield LINK",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
    ticker: (
      <>
        <Image
          alt="defi stars icon"
          src="/assets/icons/real-yield-link.png"
          boxSize={8}
        />
        <Text>RYLINK</Text>
      </>
    ),
    tradedAssets: ["LINK", "WETH", "YieldETH"],
    alternativeTo: "Lending",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Automated leverage monitoring and yield compounding.`,
        `Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.`,
        `No lockups, withdraw your tokens at any time.`,
      ],
      description: `The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).
      <br/><br/>
      Note that Real Yield LINK and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>

      `,
    },
    howItWorks: `
    The way the vault achieves this is by taking your deposited LINK token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.`,
  },
  [config.CONTRACT.REAL_YIELD_1Inch.SLUG]: {
    name: "Real Yield 1INCH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
    ticker: (
      <>
        {}
        <Image
          alt="RY1INCH icon"
          src="/assets/icons/real-yield-one-inch.png"
          boxSize={8}
        />
        <Text>RY1INCH</Text>
      </>
    ),
    tradedAssets: ["1INCH", "WETH", "YieldETH"],
    alternativeTo: "Lending",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Automated leverage monitoring and yield compounding.`,
        `Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.`,
        `No lockups, withdraw your tokens at any time.`,
      ],
      description: `The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).
      <br/><br/>
      Note that Real Yield 1INCH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
`,
    },
    howItWorks: `
    The way the vault achieves this is by taking your deposited 1INCH token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.`,
  },
  [config.CONTRACT.REAL_YIELD_ENS.SLUG]: {
    name: "Real Yield ENS",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
    ticker: (
      <>
        {}
        <Image
          alt="RYENS icon"
          src="/assets/icons/real-yield-ens.png"
          boxSize={8}
        />
        <Text>RYENS</Text>
      </>
    ),
    tradedAssets: ["ENS", "WETH", "YieldETH"],
    alternativeTo: "Lending",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Automated leverage monitoring and yield compounding.`,
        `Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.`,
        `No lockups, withdraw your tokens at any time.`,
      ],
      description: `The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).
      <br/><br/>
      Note that Real Yield ENS and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
`,
    },
    howItWorks: `
    The way the vault achieves this is by taking your deposited ENS token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.`,
  },
  [config.CONTRACT.REAL_YIELD_SNX.SLUG]: {
    name: "Real Yield SNX",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
    ticker: (
      <>
        {}
        <Image
          alt="RYSNX icon"
          src="/assets/icons/real-yield-snx.png"
          boxSize={8}
        />
        <Text>RYSNX</Text>
      </>
    ),
    tradedAssets: ["SNX", "WETH", "YieldETH"],
    alternativeTo: "Lending",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Automated leverage monitoring and yield compounding.`,
        `Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.`,
        `No lockups, withdraw your tokens at any time.`,
      ],
      description: `The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).
      <br/><br/>
      Note that Real Yield SNX and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
`,
    },
    howItWorks: `
    The way the vault achieves this is by taking your deposited SNX token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.`,
  },
  [config.CONTRACT.REAL_YIELD_UNI.SLUG]: {
    name: "Real Yield UNI",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Finally, another use for these governance tokens. Unleash yield powered by ETH staking and DeFi.`,
    ticker: (
      <>
        {}
        <Image
          alt="RYUNI icon"
          src="/assets/icons/real-yield-uni.png"
          boxSize={8}
        />
        <Text>RYUNI</Text>
      </>
    ),
    tradedAssets: ["UNI", "WETH", "YieldETH"],
    alternativeTo: "Lending",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Automated leverage monitoring and yield compounding.`,
        `Organic yield powered by an "arbitrage" between Ethereum staking rates and ETH borrow costs.`,
        `No lockups, withdraw your tokens at any time.`,
      ],
      description: `The purpose of this vault is to provide token holders with a passive yield opportunity for their assets. For some of these tokens, yield opportunities are sparse and the vault presents an opportunity to earn more yield. For other tokens, the vault presents a liquid yield opportunity that is higher than typical lending rates (at least in current conditions).
      <br/><br/>
      Note that Real Yield UNI and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
`,
    },
    howItWorks: `
    The way the vault achieves this is by taking your deposited UNI token, supplying it on Aave as collateral to borrow ETH and then depositing that ETH into the Real Yield ETH vault. For context, the Real Yield ETH vault generates yield from leveraged staking and LPing ETH and ETH LSTs. The desired net effect is that the yield earned through Real Yield ETH will be greater than the borrow costs of the ETH allowing the vault to purchase more of your deposit token to add to your position. It’s important to note that these vaults and the Real Yield ETH vault take on leverage. However, Sommelier’s novel architecture gives vaults advanced capabilities when it comes to taking on and monitoring these positions. While leveraged, the vault smart contract enforces a minimum health factor during each rebalance as a safety precaution. The vault also closely monitors on-chain conditions to mitigate liquidation risk. If market conditions change, the vault is able to rapidly adjust leverage ratios to help avoid liquidation.`,
  },
  [config.CONTRACT.FRAXIMAL.SLUG]: {
    name: "Fraximal",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `The best way to get involved in Fraxlend - automated rebalances for maximum yield.`,
    ticker: (
      <>
        <Image
          alt="FRAXIMAL icon"
          src="/assets/icons/fraximal.png"
          boxSize={8}
        />
        <Text>FRAXI</Text>
      </>
    ),
    tradedAssets: ["FRAX"],
    alternativeTo: "Manual Fraxlend optimization",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Captures highest interest rates available at any given moment.`,
        `Mitigates risk by ensuring that the vault is not overly exposed to any specific lending pool at a time.`,
        `Fully automated with built-in autocompounding.`,
      ],
      description: `The Fraximal vault is poised to offer users the best way to get involved in Fraxlend through automated repositioning to ensure the vault captures optimized yields, while avoiding the on-going gas costs of rebalancing.
      <br/><br/>
      Note that Fraximal and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: `
    On Fraxlend, the yield offered to FRAX suppliers is characteristically volatile, which offers opportunities but also requires constant monitoring and repositioning. The money market accepts a wide variety of smaller cap tokens as collateral, making for fluctuating yield opportunities ranging from 0.5% to more than 20%. This vault will automate the process of capturing the highest interest rates available at any given moment, while also mitigating risk by ensuring that the vault is not overly exposed to any specific lending pool at a time.
    `,
  },
  [config.CONTRACT.REAL_YIELD_BTC.SLUG]: {
    name: "Real Yield BTC",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Maximize WBTC-denominated yields through a dynamic and evolving set of vaults.`,
    ticker: (
      <>
        {}
        <Image
          alt="YieldBTC icon"
          src="/assets/icons/real-yield-btc.png"
          boxSize={8}
        />
        <Text>YieldBTC</Text>
      </>
    ),
    tradedAssets: ["WBTC", "WETH"],
    alternativeTo: "Lending WBTC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of pursuing multiple WBTC yield sources.`,
        `24/7 leverage monitoring reduces liquidation risk.`,
        `Fully automated with built-in auto-compounding.`,
      ],
      description: `The primary goal of Real Yield BTC is to make available sustainable WBTC-denominated yields through a dynamic and evolving set of vaults. Initially, the vault will use Morpho for efficient leveraged ETH staking against WBTC collateral. The vault may additionally borrow ETH to deposit into Real Yield ETH. In the future, there is a possibility for Real Yield BTC to evolve its capabilities by making use of other protocol integrations or Sommelier vaults.
      <br/><br/>
      Note that Real Yield BTC and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: `
    The vault will enable WBTC as collateral on Morpho to borrow ETH and then leverage stake. Any yield generated from staking in excess of the borrow cost is used to purchase WBTC to add to your position.`,
  },
  [config.CONTRACT.TURBO_SWETH.SLUG]: {
    name: "Turbo swETH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Turbocharge your swETH across an evolving set of LP strategies.`,
    ticker: (
      <>
        {}
        <Image
          alt="TurboSWETH icon"
          src="/assets/icons/turbo-sweth.png"
          boxSize={8}
        />
        <Text>TurboSWETH</Text>
      </>
    ),
    tradedAssets: ["swETH", "WETH"],
    alternativeTo: "Holding swETH",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of pursuing multiple swETH yield opportunities.`,
        `Uniswap V3 tick optimization.`,
        `Fully automated with built-in auto-compounding.`,
      ],
      description: `The initial phase of Turbo swETH will concentrate on optimizing ticks within Uniswap v3 swETH-ETH pairs due to the vault’s potential to capture sustainable real yield. The vault may also undertake a "peg defense" strategy by cost-effectively acquiring swETH from the market and establishing a narrow liquidity range close to parity. This strategic move aims to arbitrage the swETH peg to its implied value enhancing yield for vault users.
      <br/><br/>
      Lastly, the vault will have the option to allocate to swETH pools on Balancer if yields are favorable, ensuring that Turbo swETH users access the best possible yields. As swETH's presence continues to expand across the Liquid Staking DeFi ecosystem and Sommelier's roster of protocol integrations widens, the Turbo swETH vault stands poised to tap into emerging yield opportunities.
      <br/><br/>
      Note that Turbo swETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: `The vault engages in tick optimization by pairing swETH and WETH on Uniswap V3 to generate yield for depositors and to improve swap efficiency for swETH. As the Swell ecosystem grows and swETH integrates with additional applications the vault may take advantage of other yield opportunities that are whitelisted by governance. `,
  },
  [config.CONTRACT.TURBO_GHO.SLUG]: {
    name: "Turbo GHO",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Turbocharge your GHO across an evolving set of LP strategies.`,
    ticker: (
      <>
        {}
        <Image
          alt="TurboGHO icon"
          src="/assets/icons/turbo-gho.png"
          boxSize={8}
        />
        <Text>Turbo GHO</Text>
      </>
    ),
    tradedAssets: ["GHO", "USDC", "USDT", "DAI", "LUSD"],
    alternativeTo: "Holding GHO",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of pursuing multiple GHO yield opportunities.`,
        `Uniswap V3 tick optimization.`,
        `Fully automated with built-in auto-compounding.`,
      ],
      description: `Turbo GHO will be a multi-strategy vault that aims to give depositors the highest yield available for GHO and GHO/stable pairs. The innovative Sommelier vault architecture will allow Turbo GHO to allocate to the strategy or strategies that are optimal based on market conditions. A major focus for Turbo GHO will be LPing on Uniswap V3 with GHO paired with either USDC, USDT, or LUSD (the paired stable coin will be decided upon based on volume and liquidity structures). Beyond Uniswap, the vault will harness GHO's potential to implement strategies, including looping strategies on Aave. <br/><br/>
      Note that Turbo GHO and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: `The initial phase of Turbo GHO will concentrate on optimizing ticks within Uniswap v3 GHO-stablecoin pairs due to the vault’s potential to capture sustainable real yield. The vault will have the option to allocate to GHO pools on Balancer if yields are favorable, ensuring that GHO users access the best possible yields. Lastly, the vault will have the ability to borrow against GHO as part of hedging or looping strategies.`,
  },
  [config.CONTRACT.ETH_TREND_GROWTH.SLUG]: {
    name: "ETH Trend Growth",
    provider: "Silver Sun Capital Investments & Seven Seas",
    providerUrl: "https://www.silversun-capitalinvestments.com/",
    description: `Maximize your yield while outperforming the market.`,
    ticker: (
      <>
        {}
        <Image
          alt="ETH Trend Growth icon"
          src="/assets/icons/eth-trend-growth.png"
          boxSize={8}
        />
        <Text>ETHTrendGrowth</Text>
      </>
    ),
    tradedAssets: ["USDC", "YieldETH", "YieldUSD"],
    alternativeTo: "Lending USDC",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Rebalance between Real Yield ETH and Real Yield USD to maximize real yield in any market environment.`,
        `Use trend following strategies to gain exposure to ETH during uptrends to maximize exposure to upside volatility and then fully exit to stablecoins to avoid drawdowns.`,
      ],
      description: `We have been optimizing our trend-following strategy with ETH over the past 2 years to identify the best indicators that best determine when we should be fully exposed to ETH to maximize exposure to upside volatility while also setting a dynamic stop loss to minimize drawdowns. Since this strategy is focused on the daily timeframe, the trading costs are minimal to execute this strategy, and the yields from Real Yield ETH will be helpful to grow the ETH position since the average trade is held for 2-3 months based on the backtested data. When the trend-following strategy flips bearish and it is confirmed via a daily market close, the long ETH position is exited to Real Yield USD so stablecoin yield is generated while the strategy is not exposed to ETH downside volatility which minimizes drawdowns.
       <br/><br/>
      Note that ETH Trend Growth and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TURBO_STETH.SLUG]: {
    name: "Turbo stETH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo stETH"
          src="/assets/icons/turbo-steth.png"
          boxSize={8}
        />
        <Text>TurboSTETH</Text>
      </>
    ),
    tradedAssets: ["WETH", "stETH", "wstETH"],
    alternativeTo: "Holding stETH/wstETH",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of simultaneously pursuing multiple stETH/wstETH yield opportunities.`,
        `Dynamically leverage stake, Uniswap v3 liquidity provision, arbitrage wstETH peg.`,
        `Fully automated with built-in auto compounding.`,
      ],
      description: `Lido’s stETH is one of the most well-regarded and widely used ETH LSTs in DeFi. Its numerous DeFi integrations and deep liquidity make it an attractive asset to use for dynamic Sommelier strategies. This vault will focus on dynamically providing liquidity across leverage staking, concentrated liquidity provision on DEXs and LST-ETH peg arbitrage to optimize ETH yields for users.
     <br/><br/>
    Note that Turbo stETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TEST_ARBITRUM_REAL_YIELD_USD.SLUG]: {
    name: "Real Yield USD",
    provider: "Seven Seas",
    providerUrl: "https://7seas.capital/",
    description: `Maximize stablecoin yield across Aave, Compound, Uniswap, Morpho and the DAI Savings Rate.`,
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
      One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can actively optimize Uniswap V3 tick ranges. Many other yield vaults can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing vaults.`,
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
  [config.CONTRACT.TEST_ARBITRUM_MULTI_ASSET_DEPOSIT.SLUG]: {
    name: "Multi Asset Deposit",
    provider: "Seven Seas",
    providerUrl: "https://7seas.capital/",
    description: `Maximize stablecoin yield across Aave, Compound, Uniswap, Morpho and the DAI Savings Rate.`,
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
      One important reason that the Real Yield USD Strategy is able to achieve superior yields is that it can actively optimize Uniswap V3 tick ranges. Many other yield vaults can't handle this complexity and therefore just stick to lending optimization. By combining lending and LPing, Real Yield USD aims to provide higher sustained yields than simple lending or LPing vaults.`,
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
  [config.CONTRACT.TURBO_SOMM.SLUG]: {
    name: "Turbo SOMM",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Retain some exposure to SOMM while also earning swap fees generated on this trading pair.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo SOMM"
          src="/assets/icons/turbo-somm.png"
          boxSize={8}
        />
        <Text>TurboSOMM</Text>
      </>
    ),
    tradedAssets: ["SOMM", "WETH"],
    alternativeTo: "Manually LPing",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Dynamically adjusts liquidity ranges to changing market conditions.`,
      ],
      description: `Sommelier is ready to strengthen its connection with the growing collective of SOMM token holders on Ethereum, enabling them to actively engage in the SOMM community without the need to bridge out of Ethereum. This is done through the Turbo SOMM vault, which provides users the option to deposit their SOMM incentives into a separate vault focused on optimizing an ETH-SOMM LP position on Uniswap v3. Users of the vault will be able to retain some exposure to SOMM while also earning swap fees generated on this trading pair.      
      <br/><br/>
      Note that Turbo SOMM and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TURBO_EETH.SLUG]: {
    name: "Turbo eETH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Use eETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo eETH"
          src="/assets/icons/Turbo-eETH.png"
          boxSize={8}
        />
        <Text>TurboeETH</Text>
      </>
    ),
    tradedAssets: ["WETH", "eETH", "weETH"],
    alternativeTo: "Manually LPing",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of simultaneously pursuing multiple eETH yield opportunities.`,
        `Dynamically liquidity provision across multiple DEXs.`,
        `Fully automated with built-in auto compounding.`,
      ],
      description: `To start, Turbo eETH will primarily provide DEX liquidity on Uniswap V3 and Balancer to eETH-ETH pairs. The vault will also do a small amount of ETH lending on Aave and Morpho as an alternate strategy to diversify its yield sources.      
      <br/><br/>
      Note that Turbo eETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.SLUG]: {
    name: "Turbo stETH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo stETH"
          src="/assets/icons/turbo-steth2.png"
          boxSize={8}
        />
        <Text>TurboSTETH</Text>
      </>
    ),
    tradedAssets: ["stETH", "wstETH", "WETH"],
    alternativeTo: "Holding stETH/wstETH",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Capable of simultaneously pursuing multiple stETH/wstETH yield opportunities.`,
        `Dynamically leverage stake, Uniswap v3 liquidity provision, arbitrage wstETH peg.`,
        `Fully automated with built-in auto compounding.`,
      ],
      description: `Lido’s stETH is one of the most well-regarded and widely used ETH LSTs in DeFi. Its numerous DeFi integrations and deep liquidity make it an attractive asset to use for dynamic Sommelier strategies. This vault will focus on dynamically providing liquidity across leverage staking, concentrated liquidity provision on DEXs and LST-ETH peg arbitrage to optimize ETH yields for users.
     <br/><br/>
    Note that Turbo stETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.MORPHO_ETH.SLUG]: {
    name: "Morpho ETH Maximizer",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Supercharge your ETH lending and leveraged staking experience on Morpho Blue.`,
    ticker: (
      <>
        {}
        <Image
          alt="Morpho ETH Maximizer"
          src="/assets/icons/morpho-eth.png"
          boxSize={8}
        />
        <Text>MaxMorphoETH</Text>
      </>
    ),
    tradedAssets: ["WETH", "stETH", "wstETH"],
    alternativeTo: "Holding WETH or stETH/wstETH",
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Dynamically rebalance between lending and leveraged staking opportunities.`,
        `Leverage monitoring.`,
        `Fully automated with built-in auto-compounding.`,
      ],
      description: `Supercharge your ETH lending and leveraged staking experience on Morpho Blue.
     <br/><br/>
    Note that Morpho ETH Maximizer and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TURBO_DIVETH.SLUG]: {
    name: "Turbo divETH",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Unlock early access to the Diva Staking ecosystem with dynamic ETH strategies and a special DIVA token allocation, exclusively for Balancer rETH-ETH LP depositors.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo divETH"
          src="/assets/icons/turbo-diveth.png"
          boxSize={8}
        />
        <Text>TurboDIVETH</Text>
      </>
    ),
    tradedAssets: ["WETH", "rETH"],
    alternativeTo: ``,
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Designed for the Rocket Pool Community to access the Diva ecosystem.`,
        <span>
          Deposit{" "}
          <a
            href="https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112/add-liquidity"
            target="_blank"
            style={{ textDecoration: "underline", color: "white" }}
          >
            Balancer rETH-ETH LP tokens
          </a>
          .
        </span>,
        `Deposit early to get a higher DIVA token allocation.`,
        `Enjoy 0 fees until divETH strategies go live.`,
      ],
      description: `
      This vault is a cornerstone in Diva’s ecosystem, designed for enhanced ETH liquidity strategies and a DIVA token distribution to its community. 
      <br/><br/>
      Participants need to deposit <a href="https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112/add-liquidity" style="color: white; text-decoration: underline;" target="_blank">Balancer rETH-ETH LP tokens</a>, obtainable through depositing rETH, ETH, or both on Balancer. 
      <br/><br/>
      <strong>Pre-divETH Launch Phase</strong>
      <br/><br/>
      Before the official launch of Diva Staking protocol and divETH (estimated end of Q1/Q2), the Turbo divETH vault enables users to express their interest in divETH and secure their position for a DIVA token allocation. Earlier deposits qualify for a higher token allocation rate, detailed in the T&Cs.
      <br/><br/>
      <strong>Post-divETH Launch Phase</strong>
      <br/><br/>
      Upon divETH launch and oracle integration, the vault will fully integrate this asset. 
      More specifically, the assets in the BPT can be used in a potential Balancer rETH-divETH pool, essentially converting the committed ETH into divETH and enhancing rETH-divETH liquidity on a major decentralized exchange. The vault is also set to expand its strategies on platforms like Uniswap v3, Balancer/Aura, Aave, Compound, Morpho, and Fraxlend, with future protocol integrations. As Sommelier supports additional DeFi protocols, those capabilities can be added to Turbo divETH through Sommelier governance.
      <br/><br/>
      Link to the official T&Cs: <a href="https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307" style="color: white; text-decoration: underline;" target="_blank">https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307</a>
      <br/><br/>
      Note that Turbo divETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
      `,
    },
    howItWorks: ``,
  },
  [config.CONTRACT.TURBO_ETHX.SLUG]: {
    name: "Turbo ETHx",
    provider: "Seven Seas",
    providerUrl: "https://sevenseas.capital/",
    description: `Turbocharge your ETHx exposure in this multi-strategy DeFi vault.`,
    ticker: (
      <>
        {}
        <Image
          alt="Turbo ETHx"
          src="/assets/icons/turbo-ethx.png"
          boxSize={8}
        />
        <Text>TurboETHX</Text>
      </>
    ),
    tradedAssets: ["ETHx", "WETH"],
    exchange: [
      {
        name: "Sommelier",
        logo: "/assets/icons/somm.png",
      },
    ],
    strategyHighlights: {
      card: [
        `Dynamically rebalance between ETHx LP opportunities and ETHx leverage staking (when available).`,
        `Leverage monitoring. `,
        `Fully automated with built-in auto-compounding.`,
      ],
      description: `Gain exposure to ETHx DeFi opportunities through this dynamic and evolving vault.
     <br/><br/>
    Note that Turbo ETHx and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    },
    howItWorks: ``,
  },
}
