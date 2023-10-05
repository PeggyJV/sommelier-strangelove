import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"
import { PearlIcon } from "components/_icons"
import { tokenConfigMap } from "src/data/tokenConfig"

export const turboSWETH: CellarData = {
  name: "Turbo swETH",
  slug: config.CONTRACT.TURBO_SWETH.SLUG,
  tradedAssets: ["swETH", "WETH"],
  launchDate: new Date(Date.UTC(2023, 7, 24, 13, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your swETH across an evolving set of LP strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["Uniswap V3", "Balancer", "Morpho"],
  strategyAssets: ["swETH", "WETH"],
  performanceSplit: {
    depositors: 100, //80,
    "strategy provider": 0, //15,
    protocol: 0, //5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your swETH across an evolving set of LP strategies.`,

    highlights: `
      - Capable of pursuing multiple swETH yield opportunities.
      - Uniswap V3 tick optimization.
      - Fully automated with built-in auto-compounding.`,

    description: `
    The initial phase of Turbo swETH will concentrate on optimizing ticks within Uniswap v3 swETH-ETH pairs due to the vault’s potential to capture sustainable real yield. The vault may also undertake a "peg defense" strategy by cost-effectively acquiring swETH from the market and establishing a narrow liquidity range close to parity. This strategic move aims to arbitrage the swETH peg to its implied value enhancing yield for vault users.

    Lastly, the vault will have the option to allocate to swETH pools on Balancer if yields are favorable, ensuring that Turbo swETH users access the best possible yields. As swETH's presence continues to expand across the Liquid Staking DeFi ecosystem and Sommelier's roster of protocol integrations widens, the Turbo swETH vault stands poised to tap into emerging yield opportunities.

    Note that Turbo swETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault has exposure to swETH, an LST that is not redeemable until Q1 2024, which makes this LST more susceptible to depegs than its redeemable counterparts.
   
    - Because withdrawals can only be facilitated based on the available ETH-swETH liquidity in the market, it is possible to receive swETH upon withdrawal even if you deposited ETH.`,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  dashboard:
    "https://debank.com/profile/0xd33dAd974b938744dAC81fE00ac67cb5AA13958E",
  depositTokens: {
    list: ["WETH"],
  },
  config: {
    id: config.CONTRACT.TURBO_SWETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_SWETH,
    lpToken: {
      address: config.CONTRACT.TURBO_SWETH.ADDRESS,
      imagePath: "/assets/icons/turbo-sweth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_SWETH.ADDRESS,
      abi: config.CONTRACT.TURBO_SWETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.TURBO_SWETH_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_SWETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
    customRewardWithoutAPY: {
      tokenSymbol: "PEARL",
      tokenDisplayName: "Pearl",
      tokenAddress: "0x677365ac7ca3e9efe12a29a001737a3db265e8af",
      imagePath: "/assets/icons/pearl.svg",
      customRewardMessageTooltip:
        "View your Pearls at https://app.swellnetwork.io/voyage",
      customRewardMessage: "Up to 12 PEARL per swETH",
      customRewardHeader: "Daily Pearl Reward Rate",
      customRewardAPYTooltip:
        "Daily PEARL Rewards Rate: Up to 12 PEARL per swETH",
      showRewards: false,
      showClaim: true,
      customClaimMsg: "Claim All SOMM",
      logo: PearlIcon,
      logoSize: "15px",
      customRewardLongMessage:
        "Earn up to 12 PEARL per swETH of TVL deposited when you bond.",
      rewardHyperLink: "https://app.swellnetwork.io/voyage",
      customColumnHeader: "View Pearls",
      customColumnHeaderToolTip:
        "View your Pearls at https://app.swellnetwork.io/voyage",
      customColumnValue: "https://app.swellnetwork.io/voyage",
      showSommRewards: true,
      customIconToolTipMsg: "Double PEARLS ends in ",
      stakingDurationOverride: new Date(
        Date.UTC(2023, 11, 5, 0, 0, 0, 0)
      ),
    },
    baseAsset: tokenConfigMap.WETH,
    feePromotion: "Promotional 0 fee period sponsored by Swell",
    customStrategyHighlight: "Emergent Asset",
    customStrategyHighlightColor: "purple.base",
    show7DayAPYTooltip: true,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
