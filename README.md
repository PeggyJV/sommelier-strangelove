## Local ENV setup for Daily Telegram

Quickstart:

```bash
cp .env.example .env
pnpm env:check
pnpm send:daily:dry
```

Notes:
- `TELEGRAM_CHAT_ID` may be numeric or an `@handle`. Channel ids are often negative (e.g., `-100...`).
- `START_BLOCK_ALPHA_STETH` must be an integer.
- CI uses GitHub Secrets; local `.env` is ignored in CI.

# somm-boilerplate

- [Getting Started](#getting-started)
- [Using contracts](#interacting-with-contracts)
- [Hardcoded values](#hardcoded-values)
- [Data Flow](#data-flow)
  - [Getting the data](#getting-the-data)
    - [Data flow](#data-flow-1)
- [Displaying/Branching UI output](#displayingbranching-ui-output)
- [Analytics Validation](#analytics-validation)

## Getting Started

First, run the development server:

```sh

# using yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Attribution logging (Alpha STETH)

- Enable via env: `NEXT_PUBLIC_ATTRIBUTION_ENABLED=true` and Vercel KV creds (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`).
- Client capture wraps viem transports and EIP-1193 providers; events are sent to `/api/ingest-rpc`.
- CSV report: `/api/rpc-report?from=YYYY-MM-DD&to=YYYY-MM-DD&wallet=0x...` or `&contract=0x...` (optional `&domain=`).
- Extend attribution registry with `NEXT_PUBLIC_ATTRIBUTION_EXTRA_ADDRESSES=0x...,0x...`.

## Interacting with contracts

Viem and wagmi libraries are used for interacting with contracts.

Instead of creating new contract objects, you can import the existing contract from the [`useCreateContracts`](./src/data/hooks/useCreateContracts.tsx) hook and use it in the components.

- [Viem Documentation](https://viem.sh/docs/contract/getContract)
- [Wagmi Documentation](https://wagmi.sh/react/getting-started)

Calling methods syntax:

```
contract.(estimateGas|read|simulate|write).(functionName)(args, options)
```

Examples of reading and writing:

```ts
import { useCreateContracts } from "data/hooks/useCreateContracts"

const { cellarSigner } = useCreateContracts(cellarConfig)

const [isSupported, holdingPosition, depositFee] =
  (await cellarSigner?.read.alternativeAssetData([assetAddress])) as [
    boolean,
    number,
    number
  ]

const hash = cellarSigner?.write.deposit([amtInWei, address], {
  gas: gasLimitEstimated,
  account: address,
})
```

`read` call returns a single value or a list of values. The types can be seen from the contract abi.

`write` call returns tx hash.

# IP Detection using Vercel's headers

In order to block access to the app from sanctioned and restricted countries we are using Vercel's `x-vercel-ip-country` and `x-vercel-ip-country-region` to detect IP addresses. This is setup via a Next.js API route which reads the file from disk and performs a lookup against the IP. See `src/pages/api/geo.ts`.

The endpoint is hardcoded to use a restricted region unless you set the env vars `IP_COUNTRY`, and `IP_COUTNRY_REGION` (eg. `IP_COUNTRY='CA'` `IP_COUNTRY_REGION='BC'`). This API endpoint is then used by our GeoProvider (see `src/context/geoContext.tsx`). You can import the `useGeo()` hook to get access to the user's country, region, and a boolean that determines if they are in a restricted region or not. It's currently beging used in the `<Layout />` component to display a "Service Unavailable" banner and to block a user from connecting their wallet to the app.

# Multiple Sources of Truth

Unfortunately, as of writing this (03.08.22), there are multiple sources of truth cobbled together to present data to the user in the UI.

## Hardcoded values

Files of note:

- [`config.ts`](./src/utils/config.ts)
- [`cellarDataMap.ts`](./src/data/cellarDataMap.ts)
- [`tokenConfig.ts`](./src/data/tokenConfig.ts)

I outline these because they are the hardcoded data used to present asset symbols, apy, supported chains, etc. `cellarDataMap.ts` in particular is extensible, but the most fragile. It depends on an up-to-date cellar address to display the data correctly at a given cellar route. We have it set up to pull in that string from the `config.ts` file, but this certainly needs to be refactored in the future as we continue to support more strategies.

## Data Flow

Files of note:

- [`config.ts`](./src/utils/config.ts)
- [`data/cellarDataMap.ts`](./src/data/cellarDataMap.ts)
- [`data/hooks/*`](./src/data/hooks/)
- [`data/actions/*`](./src/data/actions/)

### Getting the data

If there's a new cellar with a different cellar or cellar router or staker contract that has a different ABI and output value, we should create output actions for it inside `data/actions/{CONTRACT_NAME_VERSION}/{outputName}`.

#### Data flow

![data flow](./data-flow.png)

Data reused to save fetch and data sharing efficiency through react query fetch strategy

## Displaying/Branching UI output

In the case we don't show specific UI output per cellar, We can specify what will be displayed or not inside /src/data/uiConfig.ts. Each function needs to be passed ConfigProps.

example:
We show "Rewards" only on `aave v2` cellar

```tsx
// src/data/uiConfig.ts
export const isRewardsEnabled = (config: ConfigProps) => {
  return config.cellarNameKey === CellarNameKey.AAVE
}

// somewhere in ui component
isRewardsEnabled(cellarConfig) && <RewardsCard />
```

## Analytics Validation

The Alpha stETH deposits report includes strict validation to ensure only real production data is used. The system validates all events against production data requirements and blocks Telegram messages if any violations are detected.

### Quick Health Checks

```bash
# Count last 30 days of deposits
curl -fsS https://app.somm.finance/api/deposits/by-block?days=30 | jq 'length'

# Check for test/mock patterns (should return 0)
curl -fsS https://app.somm.finance/api/deposits/by-block?days=30 \
| jq '[ .[] | select((.txHash|test("deadbeef";"i")) or (.domain|test("localhost|vercel\\.app";"i")) or (.sessionId|test("test|mock|local|dev";"i"))) ] | length' \
| grep '^0$'

# Spot check by-hash API
TX=$(curl -fsS https://app.somm.finance/api/deposits/by-block?days=30 | jq -r '.[0].txHash')
curl -fsS "https://app.somm.finance/api/deposits/by-hash?tx=$TX" | jq .
echo "Etherscan: https://etherscan.io/tx/$TX"
```

### Manual Validation

```bash
# Run comprehensive validation
./scripts/analytics/validate-prod-data.sh

# Validate only (no Telegram)
node scripts/analytics/generate-alpha-deposits.mjs --validate-only

# Generate report and send Telegram
node scripts/analytics/generate-alpha-deposits.mjs --post-telegram
```

### Validation Rules

- **Transaction Hash**: 66-char hex, no test patterns (`deadbeef`, `cafe`, etc.)
- **Address**: 40-char hex, no repeating patterns (`1111...`, `4444...`)
- **Domain**: Must be production (`.somm.finance`, `.sommelier.finance`)
- **Session ID**: No test/mock/local/dev patterns
- **Chain ID**: Must equal 1 (Ethereum mainnet)
- **Block Number**: Positive integer, not in future, within report window
- **Amount**: Finite, > 0, valid decimals
- **Token**: Must be ETH, WETH, or stETH
- **Timestamp**: Valid, not in future, consistent with block time

For detailed validation documentation, see [docs/analytics/validation-guide.md](docs/analytics/validation-guide.md).

### Alpha stETH Start Block

We enforce a start block so reports never include pre-deployment data.

#### 1. Discover the start block (one-time setup)

```bash
# Set your mainnet RPC URL and discover the start block
ETH_RPC_URL=$YOUR_MAINNET_RPC pnpm discover:startblock:alpha

# Print the discovered start block
pnpm print:startblock:alpha
```

#### 2. Set CI secret

Set the GitHub Actions secret `START_BLOCK_ALPHA_STETH` to the printed number.

#### 3. Health checks

```bash
# Verify all events are after the start block
curl -fsS "$REPORT_API_BASE/api/deposits/by-block?days=3650" | jq 'min_by(.blockNumber).blockNumber'
# Should be >= START_BLOCK_ALPHA_STETH
```

### Alpha stETH Transaction Export

One-shot files for Telegram or analysis:

```bash
# Export to files only (JSON, CSV, Markdown)
pnpm export:alpha:all

# Export and post to Telegram (chunked)
pnpm export:alpha:tg

# Export with custom limit (e.g., 100 transactions)
pnpm export:alpha:all --limit=100
pnpm export:alpha:tg --limit=50
```

**Outputs:**

- `public/reports/alpha-steth-deposits.json` - Full transaction data
- `public/reports/alpha-steth-deposits.csv` - CSV format for analysis
- `docs/analytics/alpha-steth-deposits.md` - Human-readable summary

**Required environment variables:**

- `REPORT_API_BASE` - Production API endpoint
- `START_BLOCK_ALPHA_STETH` - Contract deployment block
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` - Only for Telegram export

**Features:**

- ✅ **Production data only** - Uses existing validation and start-block enforcement
- ✅ **Chunked Telegram** - Sends large exports in readable chunks
- ✅ **Multiple formats** - JSON, CSV, and Markdown outputs
- ✅ **Safety limits** - Configurable export limits (default: 5000 transactions)
- ✅ **Comprehensive data** - Includes txHash, date, amount, block, wallet, token

# Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
