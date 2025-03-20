import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const defiStars: CellarData = {
  name: "DeFi Stars",
  slug: config.CONTRACT.DEFI_STARS.SLUG,
  dashboard:
    "https://debank.com/profile/0x03df2a53cbed19b824347d6a45d09016c2d1676a",
  tradedAssets: ["COMP", "CRV", "LDO", "MKR", "AAVE", "USDC"],
  launchDate: new Date(2023, 4, 10, 10, 0, 0, 0), // May 10, 2023. 3 pm UTC
  cellarType: CellarType.automatedPortfolio,
  description: `A long-only approach with established DeFi assets and derivatives tokens during the uptrend market periods. React quickly to market changes by managing downtrends.`,
  strategyType: "Crypto portfolio",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "2.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "1inch", "0x"],
  strategyAssets: ["COMP", "CRV", "LDO", "MKR", "AAVE", "USDC"],
  performanceSplit: {
    Depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/algo-lab.png",
    title: "AlgoLab",
    href: "https://beta.algolab.ro/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Capture upside of a basket of blue chip DeFi assets with responsive drawdown protection.`,

    highlights: `The vault:

      - Maximum capital growth preference, well suited for portfolios with an initial basket of MKR, AAVE, COMP, LDO, CRV, and USDC.

      - Carefully balanced asset allocation targets based on our custom trend indicator. Individual asset volatility and risk aversion management.

      - Automatic order size and execution frequency to improve trend reaction while reducing fees and slippage.`,
    description: `The vault provides users with a strategy to achieve strong growth in their portfolio by focusing only on high-cap assets that offer significant rewards in a future with simplified DeFi adoption. The vault's initial portfolio includes MKR, AAVE, COMP, LDO, CRV as speculative tokens and USDC as a base asset, with a default portfolio distribution of 50% USDC to reduce risk and capture later opportunities.

    To evaluate the effectiveness of the proposed strategy, we compare the portfolio's performance against a benchmark scenario of holding assets with no stop plans for price or with no stop plans for price levels and time periods. We evaluate the strategy using Return on Equity (ROE), Maximum Drawdown (MDD), and Sharpe ratio, which is a popular indicator for portfolio tracking.

    Overall, DeFi Stars provides a disciplined and diversified exposure to the DeFi sector, helping users manage downside volatility and optimize returns over time. The rebalancing strategy offers a significant improvement over the benchmark scenario and can help users achieve their goals.`,
    risks: `All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault is denominated in USDC but exposes you to volatile crypto assets, which carry a risk of potential loss.`,
  },
  // overrideApy: {
  //   title: "Backtested APY",
  //   tooltip:
  //     "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
  //   value: "84.15%",
  // },
  depositTokens: {
    list: ["USDC"],
  },

  config: {
    id: config.CONTRACT.DEFI_STARS.ADDRESS,
    cellarNameKey: CellarNameKey.DEFI_STARS,
    lpToken: {
      address: config.CONTRACT.DEFI_STARS.ADDRESS,
      imagePath: "/assets/icons/defi-stars.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.DEFI_STARS.ADDRESS,
      abi: config.CONTRACT.DEFI_STARS.ABI,
      key: CellarKey.CELLAR_V0816,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.DEFI_STARS_STAKER.ADDRESS,
      abi: config.CONTRACT.DEFI_STARS_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    baseAsset: tokenConfigMap.USDC_ETHEREUM,
    chain: chainSlugMap.ETHEREUM,
  },
  faq: [
    {
      question: "Who decides how to rebalance assets in the cellar?",
      answer:
        "Trade management and portfolio management rules are built into the algorithm, situational and back-tested parameters are applied to the decisions.",
    },
    {
      question: "What is the portfolio composition?",
      answer:
        "Initially there will be 5 DeFi tokens or their derivatives and the underlying stablecoin. Further market developments will allow additional tokens or replacement tokens to be applied.",
    },
    {
      question: "How often is the portfolio rebalanced?",
      answer: `Rebalancing trades can occur as soon as a few minutes or every few days depending on market price changes, gas quotes, parameter changes, and total value locked.`,
    },
    {
      question: "Does the vault help to cut my losses?",
      answer:
        "All trades are a balance between risk reduction and profit capture, finely tuned parameters will define stop losses and cost reduction.",
    },
    {
      question: "Does the strategy work in all market conditions?",
      answer:
        "Only long signals will be supported by the vault, however there will be a residual allocation and an upper limit allocation that will bound the actual algorithmic allocation.",
    },
    {
      question: "When should the vault be used?",
      answer:
        "This vault is most rewarding in clear (up)trending markets with strong sustained price direction and low spread/volatility.",
    },
  ],
}
