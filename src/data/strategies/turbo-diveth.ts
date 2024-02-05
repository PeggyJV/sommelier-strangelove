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
  launchDate: new Date(Date.UTC(2024, 1, 1, 16, 30, 0, 0)),
  cellarType: CellarType.yieldStrategies,
  description: `Unlock early access to the Diva Staking ecosystem with dynamic ETH strategies and a special DIVA token allocation, exclusively for Balancer rETH-ETH LP depositors.`,
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
    goals: `Unlock early access to the Diva Staking ecosystem with dynamic ETH strategies and a special DIVA token allocation, exclusively for Balancer rETH-ETH LP depositors.
    
        <table style="width:100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 8px; border: 1px solid #ddd;">Tranche</th>
        <th style="padding: 8px; border: 1px solid #ddd;">TVL Range (ETH)</th>
        <th style="padding: 8px; border: 1px solid #ddd;">DIVA/ETH/Day</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">0 - 2,000</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.50</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2,000 - 4,000</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.25</td>
      </tr>
      <tr>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">3</td>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">4,000 - 6,000</td>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.00</td>
    </tr>
    <tr>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">4</td>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">6,000 - 8,000</td>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.90</td>
  </tr>
  <tr>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">5</td>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">8,000 - 10,000</td>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.75</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">6</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">10,000 - 12,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.60</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">7</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">12,000 - 14,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.55</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">8</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">14,000 - 16,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.50</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">9</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">16,000 - 18,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.40</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">10</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">18,000 - 20,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.30</td>
</tr>
    </tbody>
  </table>
    `,

    highlights: `
    - Designed for the Rocket Pool community to access the Diva ecosystem 
    - Deposit <a href="https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112/add-liquidity" target="_blank" style="color: white; text-decoration: underline;">Balancer rETH-ETH LP tokens</a>
    - Deposit early to get a higher DIVA token allocation 
    - Enjoy 0 fees until divETH strategies go live `,

    description: `
    This vault is a cornerstone in Diva’s ecosystem, designed for enhanced ETH liquidity strategies and a DIVA token distribution to its community. 
    
    Participants need to deposit <a href="https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112/add-liquidity" style="color: white; text-decoration: underline;" target="_blank">Balancer rETH-ETH LP tokens</a>, obtainable through depositing rETH, ETH, or both on Balancer. 
    
    <strong>Pre-divETH Launch Phase</strong>
    Before the official launch of Diva Staking protocol and divETH (estimated end of Q1/Q2), the Turbo divETH vault enables users to express their interest in divETH and secure their position for a DIVA token allocation. Earlier deposits qualify for a higher token allocation rate, detailed in the T&Cs.
    
    <table style="width:100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 8px; border: 1px solid #ddd;">Tranche</th>
        <th style="padding: 8px; border: 1px solid #ddd;">TVL Range (ETH)</th>
        <th style="padding: 8px; border: 1px solid #ddd;">DIVA/ETH/Day</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">0 - 2,000</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.50</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2,000 - 4,000</td>
        <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.25</td>
      </tr>
      <tr>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">3</td>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">4,000 - 6,000</td>
      <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">2.00</td>
    </tr>
    <tr>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">4</td>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">6,000 - 8,000</td>
    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.90</td>
  </tr>
  <tr>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">5</td>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">8,000 - 10,000</td>
  <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.75</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">6</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">10,000 - 12,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.60</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">7</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">12,000 - 14,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.55</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">8</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">14,000 - 16,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.50</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">9</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">16,000 - 18,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.40</td>
</tr>
<tr>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">10</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">18,000 - 20,000</td>
<td style="padding: 8px; border: 1px solid #ddd;text-align: center;">1.30</td>
</tr>
    </tbody>
  </table>

    <strong>Post-divETH Launch Phase</strong>
    Upon divETH launch and oracle integration, the vault will fully integrate this asset. 
    More specifically, the assets in the BPT can be used in a potential Balancer rETH-divETH pool, essentially converting the committed ETH into divETH and enhancing rETH-divETH liquidity on a major decentralized exchange. The vault is also set to expand its strategies on platforms like Uniswap v3, Balancer/Aura, Aave, Compound, Morpho, and Fraxlend, with future protocol integrations. As Sommelier supports additional DeFi protocols, those capabilities can be added to Turbo divETH through Sommelier governance.
    
    Link to the official T&Cs: <a href="https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307" style="color: white; text-decoration: underline;" target="_blank">https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307</a>
    
    Note that Turbo divETH and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="textDecoration:underline"  target="_blank">User Terms</a>
    `,

    Risks: `All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:
   
    - This vault will take exposure to divETH, an emerging LST, which means that it may be more susceptible to depeg risk than some of its more established counterparts.
    - This vault does liquidity provision which can result in impermanent loss.`,
  },
  dashboard:
    "https://debank.com/profile/0x6c1edce139291Af5b84fB1e496c9747F83E876c9",
  depositTokens: {
    list: ["rETH BPT"],
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
    badges: [
      {
        customStrategyHighlight: "Deposit rETH-ETH Balancer Token",
        customStrategyHighlightColor: "orange.base",
      },
      {
        customStrategyHighlight: "DIVA Allocation",
        customStrategyHighlightColor: "#00C04B",
      },
    ],
    baseAsset: tokenConfigMap["rETH BPT_ETHEREUM"],
  },
  faq: [
    {
      question: "Are the smart contracts audited?",
      answer:
        "Yes, all smart contracts on Sommelier have been audited by an independent third-party auditor. You can find the link to the audit reports at <a style='border-bottom: 1px solid; border-color:white' href='https://www.sommelier.finance/audits' target='_blank'>sommelier.finance/audits</a>. The divETH smart contracts will also receive professional audits before the vault starts taking position with it.",
    },
    {
      question: "Who is eligible to participate?",
      answer:
        "Although there is no KYC enforced, Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the <a href='https://app.sommelier.finance/user-terms?_gl=1*1rw42lj*_gcl_au*MTIyOTI2NDM0My4xNzA2NTIxMDIy' target='_blank' style='text-decoration: underline;'>Sommelier User Terms</a>.",
    },
    {
      question:
        "How does the queue for the DIVA token allocation work?",
      answer:
        "Participants are ranked based on the order of their deposits (first-come, first-served). This ranking influences the future DIVA token distribution, with earlier deposits receiving a higher allocation rate. Details are provided in the table in the <a href='https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307?chart=bubble' style='color: white; text-decoration: underline;' target='_blank'>T&Cs</a>.",
    },
    {
      question:
        "When do tokens begin to accrue for the DIVA token allocation?",
      answer:
        "DIVA token accrual starts 30 days prior to the divETH mainnet launch and continues for 335 days after mainnet launch.",
    },
    {
      question: "What are the key dates?",
      answer:
        "<b>Vault Launch:</b> Marks the start of the “Queuing Stage”<br><br>" +
        "<b>30 Days Pre-Mainnet:</b> DIVA allocations begin to accrue for vault depositors<br><br>" +
        "<b>Mainnet Launch:</b> DIVA allocations accrue for the next 335 days<br><br>" +
        "<b>30 Days Post-Mainnet:</b> Participants can claim DIVA tokens for the first time<br><br>" +
        "<b>Oracle live for divETH:</b> Start of SOMM incentives (60 days, subject to governance approval) & the vault shifts to active DeFi LPs involving divETH (e.g., Balancer, Uniswap, etc.)",
    },
    {
      question: "What is the deposit cap for this initiative?",
      answer: "The cap is set at 20k ETH.",
    },
    {
      question: "Can I withdraw from the vault?",
      answer:
        "Yes, funds can be withdrawn at any time. However, withdrawing before the first rebalance into divETH, disqualifies you from receiving any DIVA distributions. If you withdraw after the start of active DeFi positions but before the 365-day period ends, your DIVA token accrual will be based on the actual days committed. Remember, early withdrawals don't affect your previously accrued DIVA tokens, but they do stop future accruals.",
    },
    {
      question: "When can I begin to claim my token allocation?",
      answer:
        "The claiming of DIVA tokens happens progressively during the 12 months initiative. Token claims start 30 days after the divETH mainnet launch, when 50% of accrued DIVA tokens become claimable. All phases are detailed in the <a href='https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307?chart=bubble' style='color: white; text-decoration: underline;' target='_blank'>T&Cs</a>.",
    },
    {
      question: "Where can I find the official Terms and Conditions?",
      answer:
        "The official T&Cs are available at this link: <a href='https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307?chart=bubble' style='color: white; text-decoration: underline;' target='_blank'>https://www.tally.xyz/gov/diva/proposal/96793334092430167694944466053987118900614331217239498770103733484972019888307?chart=bubble</a>",
    },
  ],
}
