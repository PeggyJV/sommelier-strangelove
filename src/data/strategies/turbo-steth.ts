import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { WstethIcon } from "components/_icons"
import { chainSlugMap } from "data/chainConfig"

export const turboSTETH: CellarData = {
  name: "Turbo stETH",
  slug: config.CONTRACT.TURBO_STETH.SLUG,
  startingShareValue: "998206828469480700",
  tradedAssets: ["WETH", "stETH", "wstETH"],
  launchDate: new Date(Date.UTC(2023, 9, 16, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["AAVE", "Morpho", "Uniswap V3", "Balancer", "Lido"],
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
    goals: `Use stETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,

    highlights: `
      - Capable of simultaneously pursuing multiple stETH/wstETH yield opportunities.
      - Dynamically leverage stake, Uniswap v3 liquidity provision, arbitrage wstETH peg.
      - Fully automated with built-in auto compounding.`,

    description: `
    Lido’s stETH is one of the most well-regarded and widely used ETH LSTs in DeFi. Its numerous DeFi integrations and deep liquidity make it an attractive asset to use for dynamic Somm strategies. This vault will focus on dynamically providing liquidity across leverage staking, concentrated liquidity provision on DEXs and LST-ETH peg arbitrage to optimize ETH yields for users.
    
    Note that Turbo stETH and Somm vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Somm <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `
    All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - This vault uses leverage which presents a risk for the vault to be liquidated. Although there are safeguards in place to help mitigate this, the liquidation risk is not eliminated.    
    
    - This vault does liquidity provision which can result in impermanent loss.
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "4.00%",
  },
  dashboard:
    "https://debank.com/profile/0xfd6db5011b171b05e1ea3b92f9eacaeeb055e971",
  depositTokens: {
    list: ["WETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_STETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_STETH,
    lpToken: {
      address: config.CONTRACT.TURBO_STETH.ADDRESS,
      imagePath: "/assets/icons/turbo-steth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_STETH.ADDRESS,
      abi: config.CONTRACT.TURBO_STETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
    badges: [
      {
        customStrategyHighlight: "Aave  & LIDO Pool Support",
        customStrategyHighlightColor: "#00C04B",
      },
      /*
      {
        customStrategyHighlight: "wstETH Incentives",
        customStrategyHighlightColor: "#00C04B",
      },
      */
    ],
    customReward: {
      showAPY: true,
      tokenSymbol: "wstETH",
      tokenDisplayName: "wstETH",
      tokenAddress: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
      imagePath: "/assets/icons/wsteth-logo.jpeg",
      //customRewardMessageTooltip?: string
      //customRewardMessage?: string
      //customRewardHeader?: string
      showBondingRewards: false,
      showClaim: false,
      //customClaimMsg?: string
      //customRewardAPYTooltip: string
      logo: WstethIcon,
      logoSize: "17px",
      //customRewardLongMessage?: string
      //rewardHyperLink?: string
      //customColumnHeader?: string
      //customColumnHeaderToolTip?: string
      //customColumnValue?: string
      stakingDurationOverride: new Date(
        Date.UTC(2023, 10, 15, 14, 0, 0, 0)
      ),
      showSommRewards: false,
      //customIconToolTipMsg?: string
    },
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Somm have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.somm.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
