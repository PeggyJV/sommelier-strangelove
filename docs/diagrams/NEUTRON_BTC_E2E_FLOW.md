# Neutron BTC Vault E2E Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ETHEREUM MAINNET                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐         ┌──────────────────────────────────────────┐     │
│   │    User      │         │       ERC-4626 BTC Vault                 │     │
│   │   Wallet     │────────▶│       0x6209...8405                      │     │
│   │              │         │                                          │     │
│   │  - WBTC      │ deposit │  - Accepts WBTC deposits                 │     │
│   │  - vaultBTC  │◀────────│  - Mints vaultBTC shares                 │     │
│   └──────────────┘ shares  │  - NAV tracking with rate limits         │     │
│                            │  - Async withdrawal queue                │     │
│                            │  - TVL cap: 0.1 BTC                      │     │
│                            └──────────────────┬───────────────────────┘     │
│                                               │                              │
│                                               │ Bridge via Axelar           │
│                                               │ (~16 min, ~$15)             │
│                                               ▼                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                │
                                    ┌───────────┴───────────┐
                                    │   AXELAR BRIDGE       │
                                    │                       │
                                    │   - Skip Go API       │
                                    │   - IBC relayers      │
                                    │   - Auto retry        │
                                    └───────────┬───────────┘
                                                │
                                                │
┌───────────────────────────────────────────────▼─────────────────────────────┐
│                              NEUTRON MAINNET                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────┐    ┌───────────────────────┐ │
│   │       CosmWasm BTC Vault                 │    │    Slinky Oracle      │ │
│   │       neutron1swqn...htmm                │    │                       │ │
│   │                                          │◀───│  Real-time BTC/USD    │ │
│   │  - Receives bridged WBTC (IBC)           │    │  price feed           │ │
│   │  - Mints vBTC share tokens               │    └───────────────────────┘ │
│   │  - NAV calculation                       │                              │
│   │  - Fee mechanics (2% mgmt, 20% perf)     │                              │
│   └──────────────────┬───────────────────────┘                              │
│                      │                                                       │
│                      │ Deploy liquidity                                      │
│                      ▼                                                       │
│   ┌──────────────────────────────────────────┐                              │
│   │         Duality DEX                      │                              │
│   │         (Bitcoin Summer Pool)            │                              │
│   │                                          │                              │
│   │  - Concentrated liquidity                │                              │
│   │  - BTC/NTRN or BTC/USDC pairs            │                              │
│   │  - Yield generation                      │                              │
│   └──────────────────────────────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Deposit Flow

```
User                    ETH Vault           Bridge Operator       Neutron Vault
  │                         │                      │                    │
  │ 1. approve(WBTC)        │                      │                    │
  │────────────────────────▶│                      │                    │
  │                         │                      │                    │
  │ 2. deposit(amount)      │                      │                    │
  │────────────────────────▶│                      │                    │
  │        vaultBTC shares  │                      │                    │
  │◀────────────────────────│                      │                    │
  │                         │                      │                    │
  │                         │ 3. bridge WBTC       │                    │
  │                         │─────────────────────▶│                    │
  │                         │                      │ 4. relay via       │
  │                         │                      │    Axelar          │
  │                         │                      │───────────────────▶│
  │                         │                      │                    │
  │                         │ 5. updateNAV()       │                    │
  │                         │◀─────────────────────│                    │
  │                         │                      │                    │
```

## Withdrawal Flow (Async)

```
User                    ETH Vault           Bridge Operator       Neutron Vault
  │                         │                      │                    │
  │ 1. requestWithdraw()    │                      │                    │
  │────────────────────────▶│                      │                    │
  │      requestId          │                      │                    │
  │◀────────────────────────│                      │                    │
  │                         │                      │                    │
  │                         │ 2. monitor queue     │                    │
  │                         │◀─────────────────────│                    │
  │                         │                      │                    │
  │                         │                      │ 3. withdraw from   │
  │                         │                      │    Neutron vault   │
  │                         │                      │───────────────────▶│
  │                         │                      │      WBTC          │
  │                         │                      │◀───────────────────│
  │                         │                      │                    │
  │                         │                      │ 4. bridge back     │
  │                         │ WBTC via Axelar      │    via Axelar      │
  │                         │◀─────────────────────│                    │
  │                         │                      │                    │
  │                         │ 5. fulfillWithdraw() │                    │
  │                         │◀─────────────────────│                    │
  │        WBTC             │                      │                    │
  │◀────────────────────────│                      │                    │
  │                         │                      │                    │
```

## NAV Sync Flow

```
Neutron Vault          Bridge Operator         ETH Vault
     │                       │                      │
     │ 1. query NAV()        │                      │
     │◀──────────────────────│                      │
     │     totalValue        │                      │
     │──────────────────────▶│                      │
     │                       │                      │
     │                       │ 2. updateNAV()       │
     │                       │─────────────────────▶│
     │                       │                      │ validate:
     │                       │                      │ - rate limit ±3%
     │                       │                      │ - 24h limit ±15%
     │                       │                      │
     │                       │      success         │
     │                       │◀─────────────────────│
     │                       │                      │
```

## Key Addresses

| Component | Chain | Address |
|-----------|-------|---------|
| ETH Vault v2 | Ethereum | `0x62099b060D18DFE221E426644d48d58ac5c68405` |
| WBTC | Ethereum | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` |
| Neutron Vault | Neutron | `neutron1swqnznjqxu85m5q074994n6tawnrxyrfaqq03u0wwa0e63tku0uq82htmm` |
| WBTC (IBC) | Neutron | `ibc/DF8722298D192AAB85D86D0462E8166234A6A9A572DD4A2EA7996029DF4DB363` |
| ETH Operator | Ethereum | `0x55a71D3337f2881C3fB3eF102E37762327690B7D` |
| Neutron Admin | Neutron | `neutron1m60g23tahccn4e9jpye4dpt9znmju283senxhq` |

## Safety Features

### Ethereum Vault
- NAV rate limits: ±3% per update, ±15% per 24h
- TVL cap: 0.1 BTC (~$10K)
- Async withdrawal queue with 7-day expiry
- Circuit breaker (pause/unpause)
- `adminSetNAV()` for emergency overrides

### Neutron Vault
- Circuit breaker (pause/unpause)
- TVL cap (configurable)
- Min deposit ($100)
- Oracle validation ($50k-$150k BTC price range)
- Staleness check (60s max)

### Bridge
- Bounded automatic retry (max 3 attempts)
- Exponential backoff (2s → 4s → 8s)
- Error classification (retryable vs non-retryable)
- Operator disable flag (`DISABLE_RETRY=1`)

## Links

- [ETH Vault on Etherscan](https://etherscan.io/address/0x62099b060D18DFE221E426644d48d58ac5c68405)
- [Neutron Vault on Mintscan](https://www.mintscan.io/neutron/wasm/contract/neutron1swqnznjqxu85m5q074994n6tawnrxyrfaqq03u0wwa0e63tku0uq82htmm)
- [GitHub Repository](https://github.com/PeggyJV/neutron-btc-vault)
