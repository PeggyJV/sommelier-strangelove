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

export const turboSWETH: CellarData = {
  name: "Turbo SWETH",
  slug: config.CONTRACT.TURBO_SWETH.SLUG,
  tradedAssets: ["SWETH", "WETH"],
  launchDate: new Date("2023-08-24T14:00:00.000Z"),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your SWETH across an evolving set of LP strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Balancer"],
  strategyAssets: ["SWETH", "WETH"],
  performanceSplit: {
    depositors: 75,
    "strategy provider": 18.75,
    protocol: 6.25,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Sevens Seas & DeFine Logic Labs",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your SWETH across an evolving set of LP strategies.`,

    highlights: `
      - Capable of pursuing multiple SWETH yield opportunities.
      - Uniswap V3 tick optimization.
      - Fully automated with built-in auto compounding.`,

    description: `
    The initial phase of Turbo SWETH will concentrate on optimizing ticks within Uniswap v3 SWETH-ETH pairs due to the vault’s potential to capture sustainable real yield. The vault may also undertake a "peg defense" strategy by cost-effectively acquiring SWETH from the market and establishing a narrow liquidity range close to parity. This strategic move aims to arbitrage the SWETH peg to its implied value enhancing yield for vault users.

    Lastly, the vault will have the option to allocate to SWETH pools on Balancer if yields are favorable, ensuring that Turbo SWETH users access the best possible yields. As SWETH's presence continues to expand across the Liquid Staking DeFi ecosystem and Sommelier's roster of protocol integrations widens, the Turbo SWETH vault stands poised to tap into emerging yield opportunities.

    Note that Turbo SWETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  dashboard:
    "https://debank.com/profile/0xa966c34f94bed0ea5c781bf1d87055d7b190cbf0",
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
        "Rewards to be distributed from Swell via airdrop at a later date",
      customRewardMessage: "6 PEARL/SWETH",
      customRewardHeader: "Daily Reward Rate",
      customRewardAPYTooltip:
        "Daily Reward Rate: 6 PEARL per SWETH of TVL",
      showRewards: false,
      showClaim: false,
      logo: PearlIcon,
      logoSize: "15px",
      customRewardLongMessage: "Earn 6 PEARL per SWETH of TVL deposited.",
    },
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}

