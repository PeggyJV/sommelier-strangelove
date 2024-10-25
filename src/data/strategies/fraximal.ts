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

export const fraximal: CellarData = {
  name: "Fraximal",
  slug: config.CONTRACT.FRAXIMAL.SLUG,
  dashboard: "https://fraximal.sevenseas.capital/",
  tradedAssets: ["FRAX"],
  launchDate: new Date(2023, 6, 5, 10, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `The best way to get involved in Fraxlend - automated rebalances for maximum yield.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Fraxlend"],
  strategyAssets: ["FRAX"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 16,
    protocol: 4,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `The best way to get involved in Fraxlend - automated rebalances for maximum yield.`,

    highlights: `The vault:

      - Captures highest interest rates available at any given moment.

      - Mitigates risk by ensuring that the vault is not overly exposed to any specific lending pool at a time.

      - Fully automated with built-in autocompounding.`,
    description: `The Fraximal vault is poised to offer users the best way to get involved in Fraxlend through automated repositioning to ensure the vault captures optimized yields, while avoiding the on-going gas costs of rebalancing.

    Note that Fraximal and Somm vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Somm <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
    risks: `All Somm vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
    
    - This vault is mainly comprised of decentralized stablecoins, which can experience depeg events.`,
  },
  depositTokens: {
    list: ["FRAX"],
  },
  config: {
    id: config.CONTRACT.FRAXIMAL.ADDRESS,
    cellarNameKey: CellarNameKey.FRAXIMAL,
    lpToken: {
      address: config.CONTRACT.FRAXIMAL.ADDRESS,
      imagePath: "/assets/icons/fraximal.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.FRAXIMAL.ADDRESS,
      abi: config.CONTRACT.FRAXIMAL.ABI,
      key: CellarKey.CELLAR_V2,
      decimals: 18,
    },
    staker: {
      address: config.CONTRACT.FRAXIMAL_STAKER.ADDRESS,
      abi: config.CONTRACT.FRAXIMAL_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    baseAsset: tokenConfigMap.FRAX_ETHEREUM,
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
