import { CellarData, CellarKey, CellarNameKey, CellarRouterKey, CellarType, StakerKey } from "data/types"
import { config } from "utils/config"
import { tokenConfigMap } from "data/tokenConfig"
import { chainSlugMap } from "data/chainConfig"

export const atlanticWeth: CellarData =  {
  name: "Atlantic WETH",
  slug: config.CONTRACT.ATLANTIC_WETH.SLUG,
  dashboard:
    "https://debank.com/profile/0x2fca566933baaf3f454d816b7947cb45c7d79102",
  tradedAssets: ["USDC", "USDC.e", "USDT", "DAI"],
  launchDate: new Date(Date.UTC(2024, 10, 29, 12, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `TODO`,
  strategyType: "TODO",
  strategyTypeTooltip: "TODO",
  managementFee: "1.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["AAVE", "Uniswap V3"],
  strategyAssets: ["USDC", "USDC.e", "USDT", "DAI"],
  performanceSplit: {
    depositors: 136,
    "strategy provider": 17,
    protocol: 3,
  },
  strategyProvider: {
    logo: "TODO",
    title: "TODO",
    href: "TODO",
    tooltip:
      "TODO",
  },
  strategyBreakdown: {
    goals: `TODO`,

    highlights: `TODO`,
    description: `TODO`,
    risks: `TODO`,
  },
  depositTokens: {
    list: ["WETH", "ETH"],
  },
  config: {
    id: config.CONTRACT.ATLANTIC_WETH.ADDRESS,
    cellarNameKey: CellarNameKey.ATLANTIC_WETH,
    lpToken: {
      address: config.CONTRACT.ATLANTIC_WETH.ADDRESS,
      imagePath: "TODO",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.ATLANTIC_WETH.ADDRESS,
      abi: config.CONTRACT.ATLANTIC_WETH.ABI,
      key: CellarKey.CELLAR_V2PT5,
      decimals: 6,
    },
    baseAsset: tokenConfigMap.USDC_ARBITRUM,
    chain: chainSlugMap.ARBITRUM,
  },
  faq: [
    {
      question: "TODO",
      answer:
        "TODO",
    },
  ],
}
