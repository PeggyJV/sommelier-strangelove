import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarType,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const lobsterAtlanticWETH: CellarData = {
  name: "Atlantic WETH",
  slug: config.CONTRACT.LOBSTER_ATLANTIC_WETH.SLUG,
  dashboard:
    "https://debank.com/profile/0x2fcA566933bAAf3F454d816B7947Cb45C7d79102",
  tradedAssets: ["WETH", "WBTC"],
  launchDate: new Date(2024, 10, 6, 14, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Outperform ETH with top-tier Liquidity Providing strategies — Effortlessly farm Lobster’s Airdrop rewards.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "3.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Uniswap V3", "1inch"],
  strategyAssets: ["WETH", "WBTC"],
  performanceSplit: {
    depositors: 136,
    "strategy provider": 0,
    protocol: 0,
  },
  strategyProvider: {
    logo: "/assets/images/lobster.png",
    title: "Lobster",
    href: "https://app.lobster-protocol.com/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Outperform ETH with top-tier Liquidity Providing strategies — Effortlessly farm Lobster’s Airdrop rewards.`,

    highlights: `
- Single-token Liquidity Providing strategy, on the WBTC-ETH pool.
- Autonomous range optimization, impermanent loss mitigation, rebalancing, and hedging.
- Automatically farm points for the upcoming Lobster Airdrop.`,
    description: `If you want to effortlessly outperform ETH, while benefiting from a top-tier DeFi strategy, you are in the right place.

With Atlantic ETH, powered by Lobster, your assets are dynamically allocated on the best Liquidity Providing positions in the market.
Its smart algorithm will autonomously handle yield optimization, rebalancing, impermanent loss mitigation, while maintaining exposure to the single token you deposited, thanks to AAVE.

By using this vault, you will automatically farm Lobster’s upcoming Airdrop Rewards, without additional action.

More information <a href="https://lobster-protocol.gitbook.io/lobster-documentation/defi-strategy/strategy-overview" target="_blank" style="text-decoration: underline;">here</a>.

User terms: <a href="https://www.lobster-protocol.com/app-terms-and-conditions" target="_blank" style="text-decoration: underline;">https://www.lobster-protocol.com/app-terms-and-conditions</a>
`,
    risks: ` 
 	All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; 
however, this list is not exhaustive, and there may be additional risks:

- This vault does liquidity provision, which can result in impermanent loss that can affect the performance. 
By anticipating it, Lobster’s algorithm is able to mitigate its impact. The APY announced is net, and already includes impermanent loss.

- This vault does lending, which means there is a liquidation risk. The constant rebalancing and the security threshold in place 
are here to mitigate this risk.`,
  },
  depositTokens: {
    list: ["WETH"],
  },

  config: {
    id: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ADDRESS,
    baseApy: 10,
    cellarNameKey: CellarNameKey.LOBSTER_ATLANTIC_WETH,
    lpToken: {
      address: config.CONTRACT.LOBSTER_ATLANTIC_WETH.TOKEN_ADDRESS,
      imagePath: "/assets/icons/lobster-atlantic-weth.png",
    },
    cellar: {
      address: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ADDRESS,
      abi: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ABI,
      key: CellarKey.CELLAR_V2,
      decimals: 18,
    },
    badges: [
      {
        customStrategyHighlight: "Lobster Airdrop Farming",
        customStrategyHighlightColor: "#00C04B",
      },
    ],
    baseAsset: tokenConfigMap.WETH_ARBITRUM,
    chain: chainSlugMap.ARBITRUM,
  },
  faq: [
    {
      question:
        "How does Atlantic ETH strategy mitigate impermanent loss ?",
      answer: `Atlantic ETH algorithm mitigates impermanent loss by dynamically adjusting liquidity ranges’ concentration. 
This strategy allows the positions to recover potential losses from price movements without needing full price reversal, 
effectively turning impermanent loss into an advantage. 
<a href="https://lobster-protocol.gitbook.io/lobster-documentation/defi-strategy/liquidity-and-impermanent-loss-management" target="_blank" style="text-decoration: underline;">
    Learn more about our approach to impermanent loss here.
</a>
`,
    },
  ],
}
