import { CellarData, CellarType } from "data/types"
import { config } from "utils/config"
import { chainSlugMap } from "data/chainConfig"
import { tokenConfigMap } from "src/data/tokenConfig"
import { CellarNameKey, CellarKey } from "data/types"

export const neutronBTCVault: CellarData = {
  name: "Neutron BTC Vault",
  slug: config.CONTRACT.NEUTRON_BTC_VAULT.SLUG,
  tradedAssets: ["WBTC"],
  launchDate: new Date(Date.UTC(2026, 0, 29, 0, 0, 0, 0)),
  isHero: false,
  cellarType: CellarType.yieldStrategies,
  description: `Cross-chain Bitcoin yield vault. Deposits on Ethereum are bridged to Neutron via Axelar for yield generation on Duality DEX.`,
  strategyType: "Cross-Chain Yield",
  strategyTypeTooltip:
    "Strategy bridges assets to Neutron for yield generation on Duality DEX",
  managementFee: "2.00%",
  managementFeeTooltip:
    "An annual charge on your deposited amount for the pro-rated period during which your deposit remains in the vault.",
  protocols: ["Neutron", "Axelar", "Duality DEX"],
  strategyAssets: ["WBTC"],
  performanceSplit: {
    depositors: 80,
    "strategy provider": 20,
    protocol: 0,
  },
  strategyProvider: {
    title: "Peggy JV",
    href: "https://github.com/PeggyJV/neutron-btc-vault",
    tooltip:
      "A Strategy Provider is responsible for providing the instructions for a cellar to execute",
  },
  strategyBreakdown: {
    goals: `Bridge WBTC to Neutron and deploy to Duality DEX for Bitcoin-denominated yield.`,

    highlights: `
    - Cross-chain architecture: Ethereum vault + Neutron vault + Axelar bridge.
    - PILOT PHASE: TVL cap of 0.1 BTC (~$10K), internal funds only.
    - Async withdrawals: Request on Ethereum, fulfilled after bridge back.
    - NAV sync with rate limits (+/-3%/update, +/-15%/24h).
    - Real-time BTC price via Slinky oracle on Neutron.`,

    description: `
    <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <strong style="color: #B45309;">PILOT PHASE</strong>
      <p style="color: #92400E; margin-top: 8px;">This vault is in pilot phase with a TVL cap of 0.1 BTC (~$10,000). Only internal operator funds are accepted during pilot. Yield may be 0% as strategy execution is not yet automated.</p>
    </div>

    <h4>Cross-Chain Architecture</h4>
    <p>The Neutron BTC Vault implements a novel cross-chain yield strategy:</p>
    <ol>
      <li><strong>Ethereum Vault (ERC-4626)</strong>: Accepts WBTC deposits, mints vaultBTC shares</li>
      <li><strong>Axelar Bridge</strong>: Transfers WBTC between chains (~16 min, ~$15)</li>
      <li><strong>Neutron Vault (CosmWasm)</strong>: Deploys liquidity to Duality DEX</li>
      <li><strong>NAV Sync</strong>: Bridge operator submits attestations to sync NAV</li>
    </ol>

    <h4>Withdrawal Flow</h4>
    <p>Withdrawals are async due to cross-chain nature:</p>
    <ol>
      <li>User calls <code>requestWithdraw()</code> on Ethereum</li>
      <li>Bridge operator bridges funds from Neutron (~16 min)</li>
      <li>Bridge operator calls <code>fulfillWithdraw()</code></li>
      <li>User receives WBTC</li>
    </ol>

    <h4>Safety Features</h4>
    <ul>
      <li>NAV rate limits: +/-3% per update, +/-15% per 24h</li>
      <li>Circuit breaker (pause/unpause)</li>
      <li>7-day withdrawal request expiry</li>
      <li>Bounded automatic retry on bridge operations</li>
    </ul>

    <h4>Documentation</h4>
    <ul>
      <li><a href="https://github.com/PeggyJV/neutron-btc-vault/blob/main/docs/operations/GO_LIVE_AUTHORIZATION.md" target="_blank" style="text-decoration: underline;">Go-Live Authorization</a></li>
      <li><a href="https://github.com/PeggyJV/neutron-btc-vault/blob/main/docs/operations/PILOT_DEPOSIT_RUNBOOK.md" target="_blank" style="text-decoration: underline;">Pilot Deposit Runbook</a></li>
      <li><a href="https://github.com/PeggyJV/neutron-btc-vault/blob/main/docs/testing/PILOT_E2E_UI_TO_SUMMER_POOL_TEST_PLAN.md" target="_blank" style="text-decoration: underline;">E2E Test Plan</a></li>
    </ul>

    Note that Neutron BTC Vault and Sommelier vaults are not open to persons or citizens of the United States and other restricted countries - for more details please refer to the Sommelier <a href="https://app.sommelier.finance/user-terms" style="text-decoration:underline" target="_blank">User Terms</a>
    `,
    Risks: `
    All Sommelier vaults contain smart contract risk and varying degrees of economic risk. Please take note of the following risks; however, this list is not exhaustive, and there may be additional risks:

    - <strong>Cross-Chain Risk</strong>: Assets are bridged via Axelar. Bridge failures may delay withdrawals.

    - <strong>Unaudited Contract</strong>: The Ethereum vault (~670 lines) has not been formally audited. TVL cap of 0.1 BTC bounds maximum loss.

    - <strong>Single Admin Key</strong>: Pilot phase uses single-key admin. Multisig migration planned post-pilot.

    - <strong>NAV Staleness</strong>: If NAV updates stop, the vault may restrict operations.

    - <strong>Withdrawal Delays</strong>: Cross-chain withdrawals require bridge operations (~16 min + operator response time).
    `,
  },
  dashboard:
    "https://www.mintscan.io/neutron/wasm/contract/neutron1swqnznjqxu85m5q074994n6tawnrxyrfaqq03u0wwa0e63tku0uq82htmm",
  depositTokens: {
    list: ["WBTC"],
  },
  config: {
    chain: chainSlugMap.ETHEREUM,
    id: config.CONTRACT.NEUTRON_BTC_VAULT.ADDRESS,
    cellarNameKey: CellarNameKey.NEUTRON_BTC_VAULT,
    lpToken: {
      address: config.CONTRACT.NEUTRON_BTC_VAULT.ADDRESS,
      imagePath: "/assets/icons/neutron-btc-vault.png",
    },
    cellar: {
      address: config.CONTRACT.NEUTRON_BTC_VAULT.ADDRESS,
      abi: config.CONTRACT.NEUTRON_BTC_VAULT.ABI,
      key: CellarKey.NEUTRON_CROSS_CHAIN,
      decimals: 8, // WBTC has 8 decimals
    },
    baseAsset: tokenConfigMap.WBTC_ETHEREUM,
    badges: [
      {
        customStrategyHighlight: "PILOT",
        customStrategyHighlightColor: "#F59E0B",
      },
    ],
  },
  faq: [
    {
      question: "What is the Neutron BTC Vault?",
      answer:
        "The Neutron BTC Vault is a cross-chain yield strategy that bridges WBTC from Ethereum to Neutron via Axelar, then deploys to Duality DEX for yield generation. It's currently in pilot phase with a 0.1 BTC TVL cap.",
    },
    {
      question: "Why is there a TVL cap?",
      answer:
        "The 0.1 BTC (~$10,000) TVL cap is a safety measure during pilot phase. This bounds maximum loss while the system is validated with real mainnet capital. The cap will be raised after successful pilot completion.",
    },
    {
      question: "How long do withdrawals take?",
      answer:
        "Withdrawals are async due to cross-chain bridging. After requesting withdrawal, the bridge operator must transfer funds from Neutron (~16 minutes bridge time) and fulfill the request. Total time depends on operator response.",
    },
    {
      question: "What is the expected yield?",
      answer:
        "During pilot phase, yield may be 0% as automated strategy execution is not yet enabled. The pilot validates infrastructure, not yield generation. See STRATEGY_EXECUTION_NOT_IN_MVP.md for details.",
    },
    {
      question: "Is the contract audited?",
      answer:
        "No, the Ethereum vault contract has not been formally audited. This is acceptable for pilot because: (1) TVL cap bounds maximum loss to ~$10K, (2) 50 tests passing (36 unit + 14 E2E), (3) Circuit breaker available, (4) NAV rate limits enforced.",
    },
    {
      question: "What is the cross-chain flow?",
      answer: `
        <ol>
          <li>Deposit WBTC to Ethereum vault, receive vaultBTC shares</li>
          <li>Bridge operator transfers WBTC to Neutron via Axelar (~16 min)</li>
          <li>Neutron vault receives WBTC, can deploy to Duality DEX</li>
          <li>NAV updates sync value back to Ethereum vault</li>
          <li>To withdraw: request on Ethereum, wait for bridge back, receive WBTC</li>
        </ol>
      `,
    },
  ],
}
