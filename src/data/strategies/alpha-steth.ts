import { CellarData, CellarType } from "data/types"
import { config } from "utils/config"
import { chainSlugMap } from "data/chainConfig"
import { tokenConfigMap } from "src/data/tokenConfig"
import { CellarNameKey, CellarKey } from "data/types"

export const alphaSteth: CellarData = {
  name: "Alpha stETH",
  slug: config.CONTRACT.ALPHA_STETH.SLUG,
  startingShareValue: "998206828469480700",
  tradedAssets: ["WETH", "stETH", "wstETH"],
  launchDate: new Date(Date.UTC(2025, 6, 5, 0, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `AlphaSTETH dynamically reallocates stETH leverage across multiple leading DeFi protocols to deliver superior ETH yield optimization.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["AAVE", "Morpho", "Euler", "Uniswap V3", "Balancer", "Lido", "Mellow", "Unichain"],
  strategyAssets: ["WETH", "stETH", "wstETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `To provide market-leading stETH-denominated yields by intelligently leveraging and reallocating assets across the highest-yielding DeFi platforms.`,

    highlights: `
    -Actively shifts leverage between top lending protocols (AAVE, Morpho, Euler) based on optimal borrowing rates.
    -Provides exposure to Unichain LP opportunities for enhanced yield diversification.
    -Allocates into Mellow vaults utilizing dvSTETH to boost ETH-native yield.
    -Automated yield optimization and auto-compounding to boost returns.
    -Potential additional yield enhancement via Lido incentive rewards. `,

    description: `
    AlphaSTETH represents the next evolution in ETH yield strategies, combining dynamic leverage management with diversified yield primitives. The strategy reallocates capital between lending markets (AAVE, Morpho, Euler), Unichain liquidity pools, and Mellow vaults (via dvSTETH), based on real-time yield opportunities and risk-adjusted performance. Leveraging smart automation and auto-compounding, AlphaSTETH delivers optimized ETH returns, while remaining flexible to integrate emerging yield sources.
    
    Note that Alpha stETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `
    All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - This vault uses leverage which presents a risk for the vault to be liquidated. Although there are safeguards in place to help mitigate this, the liquidation risk is not eliminated.    
    
    - This vault does liquidity provision which can result in impermanent loss.
    `,
  },
  // overrideApy: {
  //   title: "Backtested APY",
  //   tooltip:
  //     "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
  //   value: "4.00%",
  // },
  dashboard:
    "https://debank.com/profile/0xef417FCE1883c6653E7dC6AF7c6F85CCDE84Aa09",
  depositTokens: {
    list: ["WETH", "stETH", "wstETH", "ETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.ALPHA_STETH.ADDRESS,
    cellarNameKey: CellarNameKey.ALPHA_STETH,
    lpToken: {
      address: config.CONTRACT.ALPHA_STETH.ADDRESS,
      imagePath: "/assets/icons/alpha-steth.png",
    },
    cellar: {
      address: config.CONTRACT.ALPHA_STETH.ADDRESS,
      abi: config.CONTRACT.ALPHA_STETH.ABI,
      key: CellarKey.BORING_VAULT,
      decimals: 18,
    },
    boringVault: true,
    accountant: {
      address: config.CONTRACT.ALPHA_STETH_ACCOUNTANT.ADDRESS,
      abi: config.CONTRACT.ALPHA_STETH_ACCOUNTANT.ABI,
    },
    teller: {
      address: config.CONTRACT.ALPHA_STETH_TELLER.ADDRESS,
      abi: config.CONTRACT.ALPHA_STETH_TELLER.ABI,
    },
    boringQueue: {
      address: config.CONTRACT.ALPHA_STETH_BORING_QUEUE.ADDRESS,
      abi: config.CONTRACT.ALPHA_STETH_BORING_QUEUE.ABI,
    },
    lens: {
      address: config.CONTRACT.ALPHA_STETH_LENS.ADDRESS,
      abi: config.CONTRACT.ALPHA_STETH_LENS.ABI,
    },
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
    withdrawTokenConfig: {
      stETH: {
        minDiscount: 1,
        maxDiscount: 10,
        minimumSecondsToDeadline: 259200,
        minimumShares: 0,
      },
      wstETH: {
        minDiscount: 2,
        maxDiscount: 10,
        minimumSecondsToDeadline: 259200,
        minimumShares: 0,
      },
    },
    badges: [],
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Somm have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "How is AlphaSTETH different from TurboSTETH?",
      answer: `AlphaSTETH leverages an upgraded vault architecture to access new yield opportunities across a broader set of DeFi protocols. While TurboSTETH primarily focused on classic leverage loops, AlphaSTETH incorporates advanced strategies including Morpho and Euler lending, Unichain LP provisioning, and Mellow’s dvSTETH validator diversification — offering a more flexible and diversified approach to ETH-native yield generation.`,
    },
  ],
}
