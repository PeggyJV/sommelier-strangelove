import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const turboETHx: CellarData = {
  name: "Turbo ETHx",
  slug: config.CONTRACT.TURBO_ETHX.SLUG,
  tradedAssets: ["ETHx", "WETH", "wstETH"],
  launchDate: new Date(Date.UTC(2024, 1, 24, 14, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your ETHX exposure in this multi-strategy DeFi vault.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["Uniswap V3", "Curve", "Convex"],
  strategyAssets: ["ETHx", "WETH", "wstETH"],
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
    goals: `Turbocharge your ETHX exposure in this multi-strategy DeFi vault.`,

    highlights: `
    - Dynamically rebalance between ETHx LP opportunities and ETHx leverage staking (when available).
    - Leverage monitoring.
    - Fully automated with built-in auto-compounding.`,

    description: `Gain exposure to ETHx DeFi opportunities through this dynamic and evolving vault.
    
    Note that Turbo stETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
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
    //need to update
    "https://debank.com/profile/0xc7372Ab5dd315606dB799246E8aA112405abAeFf",
  depositTokens: {
    list: ["WETH"], //need to update

    //need to update
    // customReward: {
    //   showAPY: true,
    //   tokenSymbol: "weETH",
    //   tokenDisplayName: "weETH",
    //   tokenAddress: "0x35fa164735182de50811e8e2e824cfb9b6118ac2",
    //   imagePath: "/assets/icons/eETH.svg",
    //   customRewardMessageTooltip:
    //     "View your ether.fi Loyalty Points at https://app.ether.fi/portfolio",
    //   customRewardMessage: "Boosted ether.fi Loyalty Points",
    //   customRewardHeader: "Ether.fi Incentives",
    //   showBondingRewards: true,
    //   showClaim: true,
    //   customClaimMsg: "Claim All SOMM",
    //   //customRewardAPYTooltip: "Boosted ether.fi Loyalty Points",
    //   // logo: EETHIcon, need to add ETHx logo?
    //   logoSize: "15px",
    //   customRewardLongMessage:
    //     "Earn boosted ether.fi Loyalty Points, streamed directly when you bond.",
    //   rewardHyperLink: "https://app.ether.fi/portfolio",
    //   customColumnHeader: "View ether.fi Loyalty Points",
    //   customColumnHeaderToolTip:
    //     "View your ether.fi Loyalty Points at https://app.ether.fi/portfolio",
    //   customColumnValue: "https://app.ether.fi/portfolio",
    //   stakingDurationOverride: new Date(
    //     Date.UTC(2024, 1, 3, 14, 0, 0, 0)
    //   ),
    //   showSommRewards: true,
    //   customIconToolTipMsg:
    //     "Boosted ether.fi Loyalty Points ends in ",
    //   showOnlyBaseApy: false,
    // },
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    baseAsset: tokenConfigMap.WETH_ETHEREUM, //need to update
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
      address: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ADDRESS,
      abi: config.CONTRACT.TURBO_STETH_STETH_DEPOSIT.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    //Need to update
    // staker: {
    //   address: config.CONTRACT.TURBO_ETHX_STAKER.ADDRESS,
    //   abi: config.CONTRACT.TURBO_ETHX_STAKER.ABI,
    //   key: StakerKey.CELLAR_STAKING_V0821,
    // },

    //need to add rewards extra ETHx rewards
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
