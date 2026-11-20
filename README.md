# Somm withdrawals

A single page that lets holders exit every Somm vault on Ethereum, Arbitrum and Optimism.
Deposits, strategy pages, charts, the bridge and the CMS have been removed.

For a connected wallet it reads on-chain, per vault:

- shares in the wallet, their value (`previewRedeem`) and how much is liquid now (`maxRedeem`), then offers `redeem`
  after simulating it;
- shares staked in the legacy SOMM rewards contracts, with unbond / unstake (or `emergencyUnstake` once the owner has
  shut a program down);
- open requests in the old v0.8.21 withdraw queue, with cancel;
- Alpha stETH, which exits through its BoringQueue: request a withdrawal, or cancel a pending one.

The vault list is `src/withdraw/vaults.ts`. Everything else lives in `src/withdraw/` and `src/pages/`.
The one API route proxies the Seven Seas queue indexer for Alpha stETH requests.

## Environment

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: required for WalletConnect.
- `NEXT_PUBLIC_ALCHEMY_KEY`, or `NEXT_PUBLIC_MAINNET_RPC` / `NEXT_PUBLIC_ARBITRUM_RPC` / `NEXT_PUBLIC_OPTIMISM_RPC`.
  Without either, public RPCs are used.

## Develop

```
pnpm install
pnpm dev
pnpm run typecheck && pnpm build
```
