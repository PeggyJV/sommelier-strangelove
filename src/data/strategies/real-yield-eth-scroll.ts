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

export const realYieldEthScroll: CellarData = {
  name: "Real Yield ETH",
  slug: config.CONTRACT.REAL_YIELD_ETH_SCROLL.SLUG,
  dashboard:
    "https://debank.com/profile/0xd3bb04423b0c98abc9d62f201212f44dc2611200",
  tradedAssets: ["WETH", "wstETH", "rETH"],
  launchDate: new Date(2024, 4, 6, 15, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize your ETH through leveraged staking and liquidity provision of ETH liquid staking tokens.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Uniswap V3", "AAVE"],
  strategyAssets: ["WETH", "wstETH", "rETH"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 17,
    protocol: 3,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Maximize your ETH through leveraged staking and liquidity provision of ETH liquid staking tokens.`,

    highlights: `The vault:

      - Dynamically rebalance between ETH LST opportunities and leverage staking.

      - Leverage monitoring.

      - Fully automated with built-in auto-compounding.`,
    description: `Maximize your ETH through leveraged staking and liquidity provision of ETH liquid staking tokens.

    Note that Real Yield ETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault uses leverge, which means there is liquidation risk.
    `,
  },
  depositTokens: {
    list: ["WETH", "wstETH", "rETH"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_ETH_SCROLL.ADDRESS,
    cellarNameKey: CellarNameKey.REAL_YIELD_ETH_SCROLL,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_ETH_SCROLL.ADDRESS,
      imagePath: "/assets/icons/rye-scroll.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_ETH_SCROLL.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_ETH_SCROLL.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 18,
    },
    // staker: {
    //   address: config.CONTRACT.REAL_YIELD_ETH_SCROLL_STAKER.ADDRESS,
    //   abi: config.CONTRACT.REAL_YIELD_ETH_SCROLL_STAKER.ABI,
    //   key: StakerKey.CELLAR_STAKING_V0821,
    // },
    baseAsset: tokenConfigMap.WETH_SCROLL,
    chain: chainSlugMap.SCROLL,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
  ],
}
