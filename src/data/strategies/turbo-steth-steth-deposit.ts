import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"

export const turboSTETHstETHDeposit: CellarData = {
  name: "Turbo stETH",
  slug: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.SLUG,
  tradedAssets: ["stETH", "wstETH","WETH"],
  launchDate: new Date(Date.UTC(2023, 11, 7, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["AAVE", "Morpho", "Uniswap V3", "Balancer"],
  strategyAssets: ["stETH", "wstETH","WETH"],
  performanceSplit: {
    depositors: 100,
    "strategy provider": 0,
    protocol: 0,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,

    highlights: `
      - Capable of simultaneously pursuing multiple stETH/wstETH yield opportunities.
      - Dynamically leverage stake, Uniswap v3 liquidity provision, arbitrage wstETH peg.
      - Fully automated with built-in auto compounding.`,

    description: `
    Lido’s stETH is one of the most well-regarded and widely used ETH LSTs in DeFi. Its numerous DeFi integrations and deep liquidity make it an attractive asset to use for dynamic Sommelier strategies. This vault will focus on dynamically providing liquidity across leverage staking, concentrated liquidity provision on DEXs and LST-ETH peg arbitrage to optimize ETH yields for users.
    
    Note that Turbo stETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `
    All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - This vault uses leverage which presents a risk for the vault to be liquidated. Although there are safeguards in place to help mitigate this, the liquidation risk is not eliminated.    
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "10.00%",
  },
  dashboard:
    "https://debank.com/profile/0xc7372Ab5dd315606dB799246E8aA112405abAeFf",
  depositTokens: {
    list: ["stETH"],
  },
  config: {
    id: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_STETH_STETH_DEPOSIT,
    lpToken: {
      address: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ADDRESS,
      imagePath: "/assets/icons/turbo-steth2.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ADDRESS,
      abi: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    baseAsset: tokenConfigMap.stETH,
    badges: [
      {
        customStrategyHighlight: "Deposit stETH!",
        customStrategyHighlightColor: "orange.base",
      },
    ],
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
