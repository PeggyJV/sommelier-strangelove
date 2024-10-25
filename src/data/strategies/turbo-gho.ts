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

export const turboGHO: CellarData = {
  deprecated: true,
  name: "Turbo GHO",
  slug: config.CONTRACT.TURBO_GHO.SLUG,
  tradedAssets: ["GHO", "USDC", "USDT", "LUSD"],
  launchDate: new Date(Date.UTC(2023, 8, 14, 18, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbocharge your GHO across an evolving set of LP strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.50%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "AAVE"],
  strategyAssets: ["GHO", "USDC", "USDT", "LUSD"],
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
    goals: `Turbocharge your GHO across an evolving set of LP strategies.`,

    highlights: `
      - Capable of pursuing multiple GHO yield opportunities.
      - Uniswap V3 tick optimization.
      - Fully automated with built-in auto-compounding.`,

    description: `
    Turbo GHO will be a multi-strategy vault that aims to give depositors the highest yield available for GHO and GHO/stable pairs. The innovative Somm vault architecture will allow Turbo GHO to allocate to the strategy or strategies that are optimal based on market conditions. A major focus for Turbo GHO will be LPing on Uniswap V3 with GHO paired with either USDC, USDT, or LUSD (the paired stable coin will be decided upon based on volume and liquidity structures). Beyond Uniswap, the vault will harness GHO's potential to implement strategies, including looping strategies on Aave.
    
    Note that Turbo GHO and Somm vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Somm <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    risks: `All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault is mainly comprised of decentralized and centralized stablecoins, both of which can experience depeg events. 
    
    - Because withdrawals can only be facilitated based on the available GHO-USDC liquidity in the market, it is possible to receive GHO upon withdrawal even if you deposited USDC.

    - This vault does liquidity provision which can result in impermanent loss.
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  dashboard:
    "https://debank.com/profile/0x0C190DEd9Be5f512Bd72827bdaD4003e9Cc7975C",
  depositTokens: {
    list: ["USDC"],
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
      decimals: 6,
    },
    staker: {
      address: config.CONTRACT.TURBO_GHO_STAKER.ADDRESS,
      abi: config.CONTRACT.TURBO_GHO_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.USDC_ETHEREUM,
    badges: [
      {
        customStrategyHighlight: "Emergent Asset",
        customStrategyHighlightColor: "purple.base",
      },
      /*
      {
        customStrategyHighlight: "GHO Incentives",
        customStrategyHighlightColor: "#00C04B",
      },
      */
    ],
    /*
    customReward:  {
    showAPY: true,
    tokenSymbol: "GHO",
    tokenDisplayName: "GHO",
    tokenAddress: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
    imagePath: "/assets/icons/gho.png",
    //customRewardMessageTooltip?: string
    //customRewardMessage?: string
    //customRewardHeader?: string
    showBondingRewards: false, // Relevant only for bonding card
    showClaim: true, // True as long as somm incentives live
    //customClaimMsg?: string
    //customRewardAPYTooltip: string
    logo: GHOIcon,
    logoSize: "17px",
    //customRewardLongMessage?: string
    //rewardHyperLink?: string
    //customColumnHeader?: string
    //customColumnHeaderToolTip?: string
    //customColumnValue?: string
    stakingDurationOverride: new Date(
      Date.UTC(2023, 10, 21, 14, 0, 0, 0)
    ),
    showSommRewards: true,
    customIconToolTipMsg?: string
    customRewardEndMessage: "Rewards updated weekly",
    customSommRewardsEndMessage: "SOMM Rewards updated weekly",
    },
    */
    chain: chainSlugMap.ETHEREUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Somm have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
