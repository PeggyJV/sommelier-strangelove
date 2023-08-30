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

export const turboGHO: CellarData = {
  name: "Turbo GHO",
  slug: config.CONTRACT.TURBO_GHO.SLUG,
  tradedAssets: ["GHO", "USDC", "USDT", "DAI", "LUSD"],
  launchDate: new Date(Date.UTC(2023, 7, 29, 13, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your GHO across an evolving set of LP strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Balancer"],
  strategyAssets: ["GHO", "USDC", "USDT", "DAI", "LUSD"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 15,
    protocol: 5,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Sevens Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your GHO across an evolving set of LP strategies.`,

    highlights: `
      - Capable of pursuing multiple GHO yield opportunities.
      - Uniswap V3 tick optimization.
      - Fully automated with built-in auto-compounding.`,

    description: `
    The initial phase of Turbo GHO will concentrate on optimizing ticks within Uniswap v3 GHO-stablecoin pairs due to the vault’s potential to capture sustainable real yield. The vault will have the option to allocate to GHO pools on Balancer if yields are favorable, ensuring that GHO users access the best possible yields. Lastly, the vault will have the ability to borrow against GHO as part of hedging or looping strategies.

    As GHO’s presence continues to expand across the DeFi ecosystem and Sommelier's roster of protocol integrations widens, the Turbo GHO vault stands poised to tap into emerging yield opportunities.
    
    Note that Turbo GHO and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  dashboard:
    "https://debank.com/profile/0xcf05F416863F86ad37200379B298B7e43A3bF2bE",
  depositTokens: {
    list: ["GHO"],
  },
  config: {
    id: config.CONTRACT.TURBO_GHO.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_GHO,
    lpToken: {
      address: config.CONTRACT.TURBO_GHO.ADDRESS,
      imagePath: "/assets/icons/turbo-gho.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_GHO.ADDRESS,
      abi: config.CONTRACT.TURBO_GHO.ABI,
      key: CellarKey.CELLAR_V2PT5,
    },
    // staker: {
    //   address: config.CONTRACT.TURBO_GHO_STAKER.ADDRESS,
    //   abi: config.CONTRACT.TURBO_GHO_STAKER.ABI,
    //   key: StakerKey.CELLAR_STAKING_V0821,
    // },
    // rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
    // customRewardWithoutAPY: {
    //   tokenSymbol: "PEARL",
    //   tokenDisplayName: "Pearl",
    //   tokenAddress: "0x677365ac7ca3e9efe12a29a001737a3db265e8af",
    //   imagePath: "/assets/icons/pearl.svg",
    //   customRewardMessageTooltip:
    //     "View your Pearls at https://app.swellnetwork.io/voyage",
    //   customRewardMessage: "Up to 12 PEARL per swETH",
    //   customRewardHeader: "Daily Pearl Reward Rate",
    //   customRewardAPYTooltip:
    //     "Daily PEARL Rewards Rate: Up to 12 PEARL per swETH",
    //   showRewards: false,
    //   showClaim: true,
    //   customClaimMsg: "Claim All SOMM",
    //   logo: PearlIcon,
    //   logoSize: "15px",
    //   customRewardLongMessage:
    //     "Earn up to 12 PEARL per swETH of TVL deposited when you bond.",
    //   rewardHyperLink: "https://app.swellnetwork.io/voyage",
    //   customColumnHeader: "View Pearls",
    //   customColumnHeaderToolTip:
    //     "View your Pearls at https://app.swellnetwork.io/voyage",
    //   customColumnValue: "https://app.swellnetwork.io/voyage",
    //   showSommRewards: true,
    //   customIconToolTipMsg: "Double PEARLS ends in ",
    //   // need to update
    //   stakingDurationOverride: new Date(
    //     Date.UTC(2023, 8, 24, 13, 0, 0, 0)
    //   ),
    // },
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}