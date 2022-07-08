export interface CellarDataMap {
  [key: string]: {
    name: string
    description: string
    strategyType: string
    managementFee: string
    individualApy: string
    cellarApy: string
    protocols: string
    supportedChains: string[]
    performanceSplit: {
      [key: string]: number
    }
    strategyBreakdown: {
      [key: string]: string
    }
  }
}

export const cellarDataMap: CellarDataMap = {
  "0xd15135141f1217b8863cb1431ad71309ef22ceda": {
    name: "aave2",
    description:
      "The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis.",
    strategyType: "Stablecoin",
    managementFee: "0.25%",
    individualApy: "1.5",
    cellarApy: "5.4",
    protocols: "AAVE",
    supportedChains: [
      "DAI",
      "USDC",
      "USDT",
      "FEI",
      "TUSD",
      "BUSD",
      "GUSD",
    ],
    performanceSplit: {
      "strategy provider": 5,
      protocol: 5,
      depositors: 90,
    },
    strategyBreakdown: {
      goals: `The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis. The goal is to outperform a static strategy of lending any single stablecoin. Returns are amplified for Sommelier users as they will not suffer opportunity costs from passively sitting in less profitable lending positions at any given moment.`,
      strategy: `This strategy involves observation of several variables including Aave interest rates, rate volatility, gas fees, slippage estimations, and TVL. This data is the input for a custom predictive model which recommends position adjustments periodically. The entire process is automated as the model delivers a feed to Sommelier validators who relay necessary function calls to the Cellar.`,
      "somm alpha": `The alpha Sommelier delivers for this strategy is generated by a brilliant model that determines the precise moment that is best to capitalize on new market conditions. For the first time in DeFi history, you can benefit from a dynamic model rather than relying on static vault architecture. Cellars are not limited by rigid smart contract code which only allows positions to be adjusted under a narrow set of circumstances.

        The Aave Strategy uses high-powered predictive analytics to respond instantly when opportunity arises. Every second, we are monitoring and predicting APYs, gas fees, price volatility, liquidity, slippage and more. Rather than a simple formula such as "if gas fees <= current_apy/12, {claim_rewards}", the Aave Strategy is continually primed with real-time data points to make intelligent decisions. We bring statistics to DeFi without compromising decentralization. This has never been possible until now.`,
    },
  },
}
