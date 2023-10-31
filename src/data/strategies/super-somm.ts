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

export const superSOMM: CellarData = {
  name: "Super SOMM",
  slug: config.CONTRACT.SUPER_SOMM.SLUG,
  tradedAssets: ["SOMM", "WETH"],
  launchDate: new Date(Date.UTC(2023, 10, 1, 16, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Retain some exposure to SOMM while also earning swap fees generated on this trading pair.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.50%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "AAVE"],
  strategyAssets: ["SOMM", "WETH"],
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
    goals: `Retain some exposure to SOMM while also earning swap fees generated on this trading pair.`,

    highlights: `
      - Dynamically adjusts liquidity ranges to changing market conditions.`,

    description: `Sommelier is ready to strengthen its connection with the growing collective of SOMM token holders on Ethereum, enabling them to actively engage in the SOMM community without the need to bridge out of Ethereum. This is done through the Super SOMM vault, which provides users the option to deposit their SOMM incentives into a separate vault focused on optimizing an ETH-SOMM LP position on Uniswap v3. Users of the vault will be able to retain some exposure to SOMM while also earning swap fees generated on this trading.`,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "5.00%",
  },
  //todo
  dashboard:
    "https://debank.com/profile/0x0C190DEd9Be5f512Bd72827bdaD4003e9Cc7975C",
  depositTokens: {
    list: ["SOMM"],
  },
  config: {
    id: config.CONTRACT.SUPER_SOMM.ADDRESS,
    cellarNameKey: CellarNameKey.SUPER_SOMM,
    lpToken: {
      address: config.CONTRACT.SUPER_SOMM.ADDRESS,
      imagePath: "/assets/icons/super-somm.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.SUPER_SOMM.ADDRESS,
      abi: config.CONTRACT.SUPER_SOMM.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    staker: {
      address: config.CONTRACT.SUPER_SOMM_STAKER.ADDRESS,
      abi: config.CONTRACT.SUPER_SOMM_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0821,
    },
    baseAsset: tokenConfigMap.SOMM,
    // badges: [
    //   {
    //     customStrategyHighlight: "Emergent Asset",
    //     customStrategyHighlightColor: "purple.base",
    //   },
    //   {
    //     customStrategyHighlight: "GHO Incentives",
    //     customStrategyHighlightColor: "#00C04B",
    //   },
    // ],
  },
  // faq: [
  //   {
  //     question: "Are the smart contracts audited?",
  //     answer:
  //       "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
  //   },
  // ],
}
