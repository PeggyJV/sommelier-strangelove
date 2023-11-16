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

export const turboSOMM: CellarData = {
  name: "Turbo SOMM",
  slug: config.CONTRACT.TURBO_SOMM.SLUG,
  tradedAssets: ["SOMM", "WETH"],
  launchDate: new Date(Date.UTC(2023, 10, 9, 16, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Retain some exposure to SOMM while also earning swap fees generated on this trading pair.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.50%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3"],
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

    description: `Sommelier is ready to strengthen its connection with the growing collective of SOMM token holders on Ethereum, enabling them to actively engage in the SOMM community without the need to bridge out of Ethereum. This is done through the Turbo SOMM vault, which provides users the option to deposit their SOMM incentives into a separate vault focused on optimizing an ETH-SOMM LP position on Uniswap v3. Users of the vault will be able to retain some exposure to SOMM while also earning swap fees generated on this trading pair.
    
    Note that Turbo SOMM and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
  },
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "60%",
  },
  dashboard:
    "https://debank.com/profile/0x5195222f69c5821f8095ec565E71e18aB6A2298f",
  depositTokens: {
    list: ["SOMM"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_SOMM.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_SOMM,
    lpToken: {
      address: config.CONTRACT.TURBO_SOMM.ADDRESS,
      imagePath: "/assets/icons/turbo-somm.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_SOMM.ADDRESS,
      abi: config.CONTRACT.TURBO_SOMM.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    baseAsset: tokenConfigMap.SOMM_ETHEREUM,
    customReward: {
      showOnlyBaseApy: true,
      showAPY: false,
      showSommRewards: false,
      tokenSymbol: "SOMM",
      tokenAddress: "0xa670d7237398238de01267472c6f13e5b8010fd1",
      tokenDisplayName: "SOMM",
      imagePath: "/assets/icons/somm.png",
      stakingDurationOverride: new Date(
        Date.UTC(2023, 11, 8, 16, 0, 0, 0)
      ),
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
