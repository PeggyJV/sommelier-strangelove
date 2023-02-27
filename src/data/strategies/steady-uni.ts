import { config } from "utils/config"
import {
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { depositAssetTokenList } from "../tokenConfig"

export const steadyUni = {
  name: "Steady UNI",
  slug: config.CONTRACT.STEADY_UNI.SLUG,
  tradedAssets: ["USDC", "UNI"],
  exchange: [
    {
      name: "Sommelier",
      logo: "/assets/icons/somm.png",
    },
  ],
  launchDate: new Date(2022, 11, 29, 11, 0, 0, 0), // 29 dec 2022 12 am est
  cellarType: CellarType.automatedPortfolio,
  description: `Capture the upside of UNI price breakouts, manage downside through trailing stops. "Risk first" approach - capital preservation is prioritized over capital growth.`,
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2%",
  managementFeeTooltip:
    "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
  protocols: "Uniswap V3",
  strategyAssets: ["USDC"],
  performanceSplit: {
    depositors: 90,
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
    goals: `Capture the upside of UNI price breakouts, manage downside through trailing stops.`,

    highlights: `The cellar:

      - "Risk first" approach - capital preservation is prioritized over capital growth.

      - Always defined risk for every position prevailing from trade inception until trade exit. Increased risk profile for Steady UNI/MATIC strategies vs Steady ETH or Steady BTC.

      - Each trade strategy comprises two independent trade orders: 1 "Workhorse"  with a fixed target to lock in some return and stop + 1 "Racehorse" with a trailing stop to capture market upside.`,
    description: `Patache has pursued a pragmatic approach to developing a trading strategy instead of a strict theoretical framework. A foundation of our pragmatic approach is a "risk first" paradigm – capital preservation is prioritized over capital growth. The strategy emphasizes principal protection and steady, consistent returns while pursuing occasional "home runs."

The trade management technique of Steady UNI strategy comprises two components: a workhorse and a racehorse. The point of the workhorse is to nullify risk and capture a small profit/cover transaction cost, and the point of the racehorse is to pursue a larger payoff opportunity. Check the "How it works" section for detailed strategy performance explanations.

The Strategy is expected to capture most of any positive price breakouts and limit losses through its trailing stops. Due to the nature of the strategy, it is designed for the Cellar participant to remain committed over a medium to long term time frame (6 months to a year). In this time the benefits of being in the strategy are expected to emerge."

`,
    backtesting: `
    <table style="text-align:left;">
   <tr>
    <th></th>
    <th>Risk level 3%</th>
    <th>Risk level 6%</th>
  </tr>

  <tr>
    <td style="padding:10px; font-weight: bold">Tx Cost :</td>
    <td style="padding:10px">300</td>
    <td style="padding:10px">300<td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Beginning Cellar Value :</td>
    <td style="padding:10px">100,000</td>
    <td style="padding:10px">100,000</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Period :</td>
    <td style="padding:10px">Feb 2022 - December 2022</td>
    <td style="padding:10px">Feb 2022 - December 2022</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">No. of Trades :</td>
    <td style="padding:10px">43</td>
    <td style="padding:10px">43</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Worst Loss (Single Trade) :</td>
    <td style="padding:10px">-1,947</td>
    <td style="padding:10px">-3,935</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Worst drawdown :</td>
    <td style="padding:10px">5.60%</td>
    <td style="padding:10px">8.00%</td>
  </tr>
    <tr>
    <td style="padding:10px; font-weight: bold">Annualized Sharpe Ratio :</td>
    <td style="padding:10px">N/A</td>
    <td style="padding:10px">N/A</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Annualized Std.Dev of Return :</td>
    <td style="padding:10px">N/A</td>
    <td style="padding:10px">N/A</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Annualized Mean Return :</td>
    <td style="padding:10px">6.40%</td>
    <td style="padding:10px">17.00%</td>
  </tr>
   <tr>
    <td style="padding:10px; font-weight: bold">Cumulative profit :</td>
    <td style="padding:10px">5.00%</td>
    <td style="padding:10px">13.40%</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Win rate :</td>
    <td style="padding:10px">51%</td>
    <td style="padding:10px">51%</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Loss rate :</td>
    <td style="padding:10px">49%</td>
    <td style="padding:10px">49%</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Best month :</td>
    <td style="padding:10px">6.70%</td>
    <td style="padding:10px">14.31%</td>
  </tr>
  <tr>
    <td style="padding:10px; font-weight: bold">Worst month :</td>
    <td style="padding:10px">-4.47%</td>
    <td style="padding:10px">-6.38%</td>
  </tr>

</table>
Presented results are based on historical back tests. Past performance is not indicative of future results. Actual performance will depend on market conditions.
`,
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
    id: config.CONTRACT.STEADY_UNI.ADDRESS,
    cellarNameKey: CellarNameKey.STEADY_UNI,
    lpToken: {
      address: config.CONTRACT.STEADY_UNI.ADDRESS,
      imagePath: "/assets/icons/steady-uni.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.STEADY_UNI.ADDRESS,
      abi: config.CONTRACT.STEADY_UNI.ABI,
      key: CellarKey.CELLAR_V0816,
    },
    staker: {
      address: config.CONTRACT.STEADY_UNI_STAKER.ADDRESS,
      abi: config.CONTRACT.STEADY_UNI_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
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
