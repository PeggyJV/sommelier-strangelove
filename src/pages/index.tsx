import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useQuery } from "@tanstack/react-query"
import { useAccount, usePublicClient } from "wagmi"
import { isAddress, type Address } from "viem"
import { useRouter } from "next/router"
import { CHAINS, VAULTS, type ChainId } from "../withdraw/vaults"
import { loadChainPositions } from "../withdraw/positions"
import { PositionCard } from "../withdraw/PositionCard"
import { Logo } from "../withdraw/Logo"

const CHAIN_IDS = [1, 42161, 10] as ChainId[]

function ChainPositions({ chainId, user, readOnly }: { chainId: ChainId; user: Address; readOnly: boolean }) {
  const client = usePublicClient({ chainId })
  const q = useQuery({
    queryKey: ["positions", chainId, user],
    queryFn: () => loadChainPositions(client!, chainId, user),
    enabled: !!client,
  })
  const name = CHAINS[chainId].name
  if (q.isLoading) return <p className="muted">Checking {name}...</p>
  if (q.error)
    return (
      <p className="error">
        Could not read {name}: {(q.error as Error).message}{" "}
        <button className="link" onClick={() => q.refetch()}>
          Retry
        </button>
      </p>
    )
  const all = q.data ?? []
  // An Alpha stETH row with no wallet shares only renders if it has pending queue requests.
  const idleBoring = all.find((p) => p.vault.kind === "boring" && p.walletShares === 0n)
  const shown = all.filter((p) => p !== idleBoring)
  return (
    <>
      {shown.length === 0 && <p className="muted">No vault shares on {name}.</p>}
      {shown.map((p) => (
        <PositionCard key={`${chainId}-${p.vault.key}`} pos={p} user={user} readOnly={readOnly} onDone={() => q.refetch()} />
      ))}
      {idleBoring && <PositionCard pos={idleBoring} user={user} readOnly={readOnly} onDone={() => q.refetch()} />}
    </>
  )
}

export default function Home() {
  const { address } = useAccount()
  // ?address=0x... shows any wallet's positions read-only (for support, or checking a cold wallet).
  const q = useRouter().query.address
  const viewAddr = typeof q === "string" && isAddress(q) ? (q as Address) : undefined
  const user = viewAddr ?? address
  const readOnly = !address || (!!viewAddr && viewAddr.toLowerCase() !== address.toLowerCase())
  return (
    <main className="page">
      <header className="top">
        <div className="brand">
          <Logo height={26} />
          <span className="brand-tag">Withdrawals</span>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>

      <h1>
        Get your funds out of <span className="gradient-text">Somm vaults</span>
      </h1>

      <section className="notice">
        <p>
          Somm vaults are closed to new deposits. This page does one thing: get your funds out. Connect the wallet
          that holds your vault shares and every position on Ethereum, Arbitrum and Optimism will show below, with
          the steps needed to withdraw it.
        </p>
        <p className="muted">
          Everything here reads from and writes to the vault contracts directly. Each transaction is simulated
          before your wallet asks you to sign it.
        </p>
      </section>

      {user && readOnly && (
        <p className="warn">
          Viewing {user} read-only. Connect this wallet to withdraw.
        </p>
      )}
      {user ? (
        CHAIN_IDS.map((id) => (
          <section key={id} className="chain">
            <h2>{CHAINS[id].name}</h2>
            <ChainPositions chainId={id} user={user} readOnly={readOnly} />
          </section>
        ))
      ) : (
        <section className="chain">
          <h2>Supported vaults</h2>
          <ul className="vault-list">
            {VAULTS.map((v) => (
              <li key={`${v.chainId}-${v.key}`}>
                <span>{v.name}</span>
                <span className="muted">{CHAINS[v.chainId].name}</span>
                <a className="mono" href={`${CHAINS[v.chainId].explorer}/address/${v.address}`} target="_blank" rel="noreferrer">
                  {v.address.slice(0, 6)}...{v.address.slice(-4)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
