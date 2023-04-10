import { config } from "utils/config"
import {
  CellarKey,
  CellarNameKey,
  CellarRouterKey,
  CellarType,
  StakerKey,
} from "../types"

export const realYieldEth = {
  name: "Real Yield ETH",
  slug: config.CONTRACT.REAL_YIELD_ETH.SLUG,
  tradedAssets: ["stETH", "cbETH", "rETH", "WETH"],
  exchange: [
    {
      name: "Sommelier",
      logo: "/assets/icons/somm.png",
    },
  ],
  launchDate: new Date(2023, 3, 12, 11, 0, 0, 0),
  cellarType: CellarType.yieldStrategies,
  description: `Maximize ETH yield through Aave and Compound leveraged staking and Uniswap V3 liquidity provision of ETH liquid staking tokens.`,
  strategyType: "Stablecoin",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0.5%",
  managementFeeTooltip:
    "Platform fee split: 1.5% for Strategy provider and 0.5% for protocol",
  protocols: ["AAVE", "Compound", "Uniswap V3"],
  strategyAssets: ["stETH", "cbETH", "rETH", "ETH"],
  performanceSplit: {
    depositors: 80,
    protocol: 5,
    "strategy provider": 15,
  },
  strategyProvider: {
    logo: "/assets/images/seven-seas.png",
    title: "Seven Seas & DeFine Logic Labs",
    href: "https://7seas.capital/",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Catch trends early by predicting the significant movement of prices consistently and accurately. Capture the majority of ETH price breakouts, and limit losses through trailing stops.`,

    highlights: `The cellar:

      - Accumulates leverage using a method that is highly capital efficient and significantly reduces gas and flash loan fees.

      - Active strategy which optimally allocates capital across key protocols for best-in-class yields.

      - Optimizes Uniswap  V3 tick ranges.`,
    description: `Liquid Staked Tokens (LSTs) have gained significant traction since Ethereum's transition to proof-of-stake by allowing users to earn staking yield while also using that capital within DeFi, resolving the tension between securing the network and accessing liquidity to pursue DeFi opportunities. The innovations from liquid staking providers like Lido and RocketPool have seen LSTs become a growing component of Ethereum DeFi, and Real Yield ETH is poised to be a powerful vault for capturing organic yield across prominent LSTs.
    <br/><br/>
    Note that Real Yield ETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>`,
  },
  depositTokens: {
    list: ["stETH", "cbETH", "rETH", "WETH"],
  },

  config: {
    id: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
    baseApy: 4.4,
    cellarNameKey: CellarNameKey.REAL_YIELD_ETH,
    lpToken: {
      address: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
      imagePath: "/assets/icons/real-yield-eth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.REAL_YIELD_ETH.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_ETH.ABI,
      key: CellarKey.CELLAR_V2,
    },
    staker: {
      address: config.CONTRACT.REAL_YIELD_ETH_STAKER.ADDRESS,
      abi: config.CONTRACT.REAL_YIELD_ETH_STAKER.ABI,
      key: StakerKey.CELLAR_STAKING_V0815,
    },
    rewardTokenAddress: config.CONTRACT.SOMMELLIER.ADDRESS,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "What are the risks?",
      answer: `Risks include the typical risks associated with using stablecoins in DeFi. This includes smart contract risk and stablecoin depeg risk. Additionally, in the Cellars V2 architecture, Uniswap V3 liquidity positions are non-withdrawable. Because of this, withdrawing those assets from the strategy may not be possible at all times. However, the strategy provider, SevenSeas, will ensure that some percentage of funds are always kept in liquid positions to be withdrawn.This type of technical limitation is also present in other stablecoin yield opportunities like Origin USD (a Convex position may inhibit withdrawals) and Yearn positions.`,
    },
    {
      question:
        "What actions vault takes in extreme market situations/volatility cases?",
      answer:
        "In extreme market conditions, the vault will seek to take a conservative capital preservation stance.",
    },
  ],
}
