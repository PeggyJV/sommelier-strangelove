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

export const turboETHx: CellarData = {
  name: "Turbo ETHx",
  slug: config.CONTRACT.TURBO_ETHX.SLUG,
  tradedAssets: ["ETHx", "WETH"],
  launchDate: new Date(Date.UTC(2024, 1, 2, 18, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your ETHX exposure in this multi-strategy DeFi vault.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: [
    "Uniswap V3",
    "Curve",
    "Convex",
    "Balancer",
    "Morpho Blue",
  ],
  strategyAssets: ["ETHx", "WETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 17,
    protocol: 3,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://sevenseas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Turbocharge your ETHx exposure in this multi-strategy DeFi vault.`,

    highlights: `
    - Dynamically rebalance between ETHx LP opportunities and ETHx leverage staking (when available).
    - Leverage monitoring.
    - Fully automated with built-in auto-compounding.`,

    description: `Gain exposure to ETHx DeFi opportunities through this dynamic and evolving vault.
    
    Note that Turbo ETHx and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    Risks: `
    All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - This vault has exposure to ETHx, an emerging LST, which means that it is more susceptible to depegs than its more established counterparts.
    - This vault may use leverge in the future, which means there is liquidation risk.`,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "10.00%",
  },
  dashboard:
    "https://debank.com/profile/0x19B8D8FC682fC56FbB42653F68c7d48Dd3fe597E",
  depositTokens: {
    list: ["ETHx", "WETH"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    baseAsset: tokenConfigMap.WETH_ETHEREUM,
    id: config.CONTRACT.TURBO_ETHX.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_ETHX,
    lpToken: {
      address: config.CONTRACT.TURBO_ETHX.ADDRESS,
      imagePath: "/assets/icons/turbo-ethx.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_ETHX.ADDRESS,
      abi: config.CONTRACT.TURBO_ETHX.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },

    staker: {
      address: config.CONTRACT.TURBO_ETHX_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_ETHX_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    // customReward: {
    //   showAPY: true,
    //   tokenSymbol: "ETHx",
    //   tokenDisplayName: "ETHx",
    //   showSommRewards: true,
    //   logo: ETHXIcon,
    //   logoSize: "15px",
    //   tokenAddress: "0xa35b1b31ce002fbf2058d22f30f95d405200a15b",
    //   imagePath: "/assets/icons/ETHx.svg",
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
