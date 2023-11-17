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

export const turboeETH: CellarData = {
  name: "Turbo eETH",
  slug: config.CONTRACT.TURBO_EETH.SLUG,
  tradedAssets: ["WETH", "eETH"],
  launchDate: new Date(Date.UTC(2023, 10, 27, 16, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Use eETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.50%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "Balancer", "Morpho", "AAVE"],
  strategyAssets: ["WETH", "eETH"],
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
    goals: `Use eETH to turbocharge your ETH yields across an evolving set of DeFi strategies.`,

    highlights: `
    - Capable of simultaneously pursuing multiple eETH yield opportunities.
    - Dynamically liquidity provision across multiple DEXs.
    - Fully automated with built-in auto compounding.`,

    description: `To start, Turbo eETH will primarily provide DEX liquidity on Uniswap V3 and Balancer to eETH-ETH pairs. The vault will also do a small amount of ETH lending on Aave and Morpho as an alternate strategy to diversify its yield sources.
    
    Note that Turbo eETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "60%",
  },

  //need to update when contract is deployed
  dashboard:
    "https://debank.com/profile/0x5195222f69c5821f8095ec565E71e18aB6A2298f",
  depositTokens: {
    list: ["WETH"],
  },
  config: {
    id: config.CONTRACT.TURBO_EETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_EETH,
    lpToken: {
      address: config.CONTRACT.TURBO_EETH.ADDRESS,
      imagePath: "/assets/icons/Turbo-eETH.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_EETH.ADDRESS,
      abi: config.CONTRACT.TURBO_EETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    baseAsset: tokenConfigMap.WETH,
    // customReward: {
    //   showOnlyBaseApy: true,
    //   showAPY: false,
    //   showSommRewards: false,
    //   tokenSymbol: "SOMM",
    //   tokenAddress: "0xa670d7237398238de01267472c6f13e5b8010fd1",
    //   tokenDisplayName: "SOMM",
    //   imagePath: "/assets/icons/somm.png",
    //   stakingDurationOverride: new Date(
    //     Date.UTC(2023, 11, 8, 16, 0, 0, 0)
    //   ),
    //},
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
