import { config } from "utils/config"
import {
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { depositAssetTokenList } from "../tokenConfig"

export const steadyMatic = {
  name: "Steady MATIC",
  launchDate: new Date(2022, 11, 29, 11, 0, 0, 0), // 29 dec 2022 12 am est
  cellarType: CellarType.automatedPortfolio,
  description: `Capture the upside of MATIC price breakouts, manage downside through trailing stops. "Risk first" approach - capital preservation is prioritized over capital growth.`,
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
    goals: `TODO`,

    highlights: `The cellar:

      - "Risk first" approach - capital preservation is prioritized over capital growth.

      - Always defined risk for every position prevailing from trade inception until trade exit.

      - Each trade strategy comprises two independent trade orders: 1 "Workhorse"  with a fixed target to lock in some return and stop + 1 "Racehorse" with a trailing stop to capture market upside.`,
    description: `Capture the upside of MATIC price breakouts, manage downside through trailing stops.`,
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
    id: config.CONTRACT.STEADY_MATIC.ADDRESS,
    cellarNameKey: CellarNameKey.STEADY_MATIC,
    lpToken: {
      address: config.CONTRACT.STEADY_MATIC.ADDRESS,
      imagePath: "/assets/icons/steady-btc.svg",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.STEADY_BTC.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC.ABI,
      key: CellarKey.CELLAR_V0816,
    },
    staker: {
      address: config.CONTRACT.STEADY_BTC_STAKER.ADDRESS,
      abi: config.CONTRACT.STEADY_BTC_STAKER.ABI,
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
