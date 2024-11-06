import { config } from "utils/config"
import {
  CellarData,
  CellarKey,
  CellarNameKey,
  CellarType,
} from "../types"
import { tokenConfigMap } from "src/data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const lobsterAtlanticWETH: CellarData = {
  name: "Lobster Atlantic WETH",
  slug: config.CONTRACT.LOBSTER_ATLANTIC_WETH.SLUG,
  dashboard:
    "https://debank.com/profile/0x2fcA566933bAAf3F454d816B7947Cb45C7d79102",
  tradedAssets: ["WBTC", "WETH"],
  launchDate: new Date(2024, 1, 13, 14, 30, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `TODO`,
  strategyType: "Yield",
  strategyTypeTooltip: "TODO",
  managementFee: "3.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Uniswap V3", "1inch"],
  strategyAssets: ["WBTC", "WETH"],
  performanceSplit: {
    depositors: 136,
    "strategy provider": 0,
    protocol: 0,
  },
  strategyProvider: {
    logo: "/assets/images/lobster.png",
    title: "Lobster",
    href: "https://app.lobster-protocol.com/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `TODO`,

    highlights: `TODO`,
    description: `TODO`,
    risks: `TODO`,
  },
  depositTokens: {
    list: ["WETH"],
  },

  config: {
    id: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ADDRESS,
    baseApy: 10,
    cellarNameKey: CellarNameKey.LOBSTER_ATLANTIC_WETH,
    lpToken: {
      address: config.CONTRACT.LOBSTER_ATLANTIC_WETH.TOKEN_ADDRESS,
      imagePath: "/assets/icons/lobster-atlantic-weth.png",
    },
    cellar: {
      address: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ADDRESS,
      abi: config.CONTRACT.LOBSTER_ATLANTIC_WETH.ABI,
      key: CellarKey.CELLAR_V2,
      decimals: 18,
    },
    baseAsset: tokenConfigMap.WETH_ARBITRUM,
    chain: chainSlugMap.ARBITRUM,
  },

  faq: [
    {
      question: "TODO",
      answer: "TODO",
    },
  ],
}
