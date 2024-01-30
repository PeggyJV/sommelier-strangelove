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

export const turbodivETH: CellarData = {
  name: "Turbo divETH",
  slug: config.CONTRACT.TURBO_DIVETH.SLUG,
  tradedAssets: ["WETH", "rETH"],
  //need to update after testing
  launchDate: new Date(Date.UTC(2024, 0, 29, 15, 0, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Turbo divETH provides a single entry point into the Diva DeFi ecosystem.`,
  strategyType: "Yield",
  strategyTypeTooltip: "Strategy takes long positions in crypto",
  managementFee: "0%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault",
  protocols: ["Aura", "Balancer"],
  strategyAssets: ["WETH", "rETH"],
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
    goals: `Turbo divETH provides a single entry point into the Diva DeFi ecosystem.`,

    highlights: `
    - Designed for the Rocket Pool Community to access the Diva ecosystem 
    - Deposit Balancer rETH-ETH LP tokens
    - Deposit early to get a higher DIVA token allocation 
    - Enjoy 0 fees until divETH strategies go live 
    - Fully automated with built-in auto compounding`,

    description: `Pre-divETH Launch Phase 
    While the Diva Staking protocol and divETH won't officially launch until later (current ETA: end of Q1/Q2), the Turbo divETH vault allows users to signal their interest in divETH by depositing into the vault to secure their spot in the queue for a DIVA token allocation. Users who deposit earlier into the vault are eligible for a token allocation at a higher rate than those who deposit later, as shown in the table in the FAQ.
    
    Post-divETH Launch Phase
    Once divETH launches and receives oracle support, the vault can officially integrate the asset into its operations. More specifically, the assets in the BPT can be used in a potential Balancer rETH-divETH pool, essentially converting the committed ETH into divETH and adding liquidity for rETH-divETH on a major decentralized exchange. As divETH proliferates, the vault can run additional liquidity provision and lending strategies on the following protocols: Uniswap v3, Balancer/Aura, Aave, Compound, Morpho, Morpho Blue, and Fraxlend. As Sommelier supports additional DeFi protocols, those capabilities can be added to Turbo divETH through Sommelier governance.
    
    Note that Turbo divETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,
    Risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault will take exposure to divETH, an emerging LST, which means that it is more susceptible to depegs than its more established counterparts.
    - This vault does liquidity provision which can result in impermanent loss.`,
  },
  //need to update
  overrideApy: {
    title: "Backtested APY",
    tooltip:
      "Backtested APY results are based on historical backtests. Past performance is not indicative of future results. Actual performance will depend on market conditions",
    value: "6%",
  },
  dashboard:
    "https://debank.com/profile/0x6c1edce139291Af5b84fB1e496c9747F83E876c9",
  depositTokens: {
    list: ["BrETHSTABLE"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.TURBO_DIVETH.ADDRESS,
    cellarNameKey: CellarNameKey.TURBO_DIVETH,
    lpToken: {
      address: config.CONTRACT.TURBO_DIVETH.ADDRESS,
      imagePath: "/assets/icons/turbo-diveth.png",
    },
    cellarRouter: {
      address: config.CONTRACT.CELLAR_ROUTER_V0816.ADDRESS,
      abi: config.CONTRACT.CELLAR_ROUTER_V0816.ABI,
      key: CellarRouterKey.CELLAR_ROUTER_V0816,
    },
    cellar: {
      address: config.CONTRACT.TURBO_DIVETH.ADDRESS,
      abi: config.CONTRACT.TURBO_DIVETH.ABI,
      key: CellarKey.CELLAR_V2PT6,
      decimals: 18,
    },
    baseAsset: tokenConfigMap.BrETHSTABLE_ETHEREUM,
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. And you can find the link of audit reports here <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>",
    },
    {
      question: "Who is eligible to participate?",
      answer:
        "All rebalancing decisions are based on quantitative rules that are developed from historical price movements. The rules are dynamic and can change as market conditions change. The strategy gets information about price movements and market conditions from a range of quantitative metrics. Humans run the backtests and use simulation models and data science methods to develop the rules, but the rebalancing decision is made automatically by the computer following the quantitative rules that have been set for it.",
    },
    {
      question:
        "How does the queue for the DIVA token allocation work?",
      answer:
        "Users will be assigned a ranking based on a first-come, first-served principle. This ranking will be used to determine future token distribution, with those depositing earlier enjoying higher distribution rates. [include table to right]",
    },
    {
      question:
        "When do tokens begin to accrue for the DIVA token allocation?",
      answer:
        "The earliest token accrual of DIVA tokens will be 30 days prior to divETH mainnet launch and will continue for 335 days after mainnet launch.",
    },
    {
      question: "When can I begin to claim my token allocation?",
      answer: `Token claims will occur in four phases:
        Phase 1: 30 days after divETH mainnet launch, vault depositors can claim 50% of their accrued DIVA tokens as an initial allocation for their participation. That is 50% of the tokens accrued during the 30 days from [divETH mainnet launch - 30 days] until [divETH mainnet launch + 30 days], which is approximately 8% of the max potential accrual.
        Phase 2: On day 120 of the program [divETH mainnet launch + 90 days], vault depositors can claim the unclaimed 50% of tokens from Phase 1 in addition to 50% of the tokens accrued in Phase 2. This represents approximately 16% of the max potential accrual.
        Phase 3: On day 240 of the program [divETH mainnet launch + 210 days], users can claim the unclaimed 50% of tokens accrued in Phase 2 in addition to 50% of the tokens accrued in Phase 3. This represents approximately 25% of the max potential accrual.
        Phase 4: On day 365 of the program [divETH mainnet launch + 335 days], users can claim the unclaimed 50% of tokens accrued in Phase 3 in addition to 100% of the tokens accrued in Phase 4. This represents approximately 51% of the max potential accrual.
        As a reminder, early redemptions do not imply losing eligibility in a retroactive manner, but it does imply forgoing future accruals.`,
    },

    {
      question:
        "What are the minimum and maximum deposits eligible for DIVA token allocation?",
      answer:
        "The minimum deposit is set at 0.1 B-rETH-STABLE while the maximum deposit for a single depositor is 10,000 B-rETH-STABLE.",
    },
    {
      question: "What is the deposit cap for this initiative?",
      answer: "The cap on this initiative is 20k ETH.",
    },
    {
      question: "Can I withdraw from the vault?",
      answer:
        "Funds can be withdrawn at any time. However, if you redeem prior to when the vault begins taking its active DeFi positions, which we define as the first rebalance into the divETH asset, you won't qualify for any DIVA distributions. For redemptions that take place between the start of active DeFi positions and the 365-day deadline, accrual is determined by the count of full commitment days.",
    },
    {
      question: "When can I begin to claim my token allocation?",
      answer: `Token claims will occur in four phases:
        Phase 1: 30 days after divETH mainnet launch, vault depositors can claim 50% of their accrued DIVA tokens as an initial allocation for their participation. That is 50% of the tokens accrued during the 30 days from [divETH mainnet launch - 30 days] until [divETH mainnet launch + 30 days], which is approximately 8% of the max potential accrual.
        Phase 2: On day 120 of the program [divETH mainnet launch + 90 days], vault depositors can claim the unclaimed 50% of tokens from Phase 1 in addition to 50% of the tokens accrued in Phase 2. This represents approximately 16% of the max potential accrual.
        Phase 3: On day 240 of the program [divETH mainnet launch + 210 days], users can claim the unclaimed 50% of tokens accrued in Phase 2 in addition to 50% of the tokens accrued in Phase 3. This represents approximately 25% of the max potential accrual.
        Phase 4: On day 365 of the program [divETH mainnet launch + 335 days], users can claim the unclaimed 50% of tokens accrued in Phase 3 in addition to 100% of the tokens accrued in Phase 4. This represents approximately 51% of the max potential accrual.
        As a reminder, early redemptions do not imply losing eligibility in a retroactive manner, but it does imply forgoing future accruals.`,
    },
  ],
}
