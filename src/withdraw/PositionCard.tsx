import React, { createContext, useContext, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useConfig, usePublicClient } from "wagmi"
import { formatUnits, type Abi, type Address } from "viem"
import { boringQueueAbi, cellarAbi, stakerAbi, withdrawQueueAbi } from "./abis"
import { ALPHA_STETH_QUEUE, CHAINS, WITHDRAW_QUEUE } from "./vaults"
import { loadBoringRequests, type Position } from "./positions"
import { errorText, send } from "./tx"

const fmt = (v: bigint | undefined, decimals: number) => {
  if (v === undefined) return "?"
  const s = formatUnits(v, decimals)
  const [i, f = ""] = s.split(".")
  const frac = f.slice(0, 6).replace(/0+$/, "")
  const out = frac ? `${i}.${frac}` : i
  return out === "0" && v > 0n ? "<0.000001" : out
}

const when = (ts: number) => new Date(ts * 1000).toLocaleString()

type Step = { label: string; run: () => Promise<unknown> }

// Set when showing someone else's wallet: every action renders disabled.
const ReadOnly = createContext(false)

function Action({ step, disabled, onDone }: { step: Step; disabled?: boolean; onDone: () => void }) {
  const readOnly = useContext(ReadOnly)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string>()
  const [hash, setHash] = useState<string>()
  return (
    <div className="action">
      <button
        className="primary"
        disabled={disabled || busy || readOnly}
        onClick={async () => {
          setBusy(true)
          setErr(undefined)
          try {
            const h = await step.run()
            if (typeof h === "string") setHash(h)
            onDone()
          } catch (e) {
            setErr(errorText(e))
          } finally {
            setBusy(false)
          }
        }}
      >
        {busy ? "Waiting for wallet / confirmation..." : step.label}
      </button>
      {hash && <span className="ok">Confirmed</span>}
      {err && <span className="error">{err}</span>}
    </div>
  )
}

export function PositionCard(props: { pos: Position; user: Address; readOnly: boolean; onDone: () => void }) {
  return (
    <ReadOnly.Provider value={props.readOnly}>
      <Card {...props} />
    </ReadOnly.Provider>
  )
}

function Card({ pos, user, onDone }: { pos: Position; user: Address; onDone: () => void }) {
  const config = useConfig()
  const { vault } = pos
  const chainId = vault.chainId
  const explorer = CHAINS[chainId].explorer
  const totalShares = pos.walletShares + pos.stakedShares
  if (vault.kind === "boring" && pos.walletShares === 0n) {
    return <BoringWithdraw pos={pos} user={user} onDone={onDone} standalone />
  }
  const asset = (v: bigint | undefined) => `${fmt(v, pos.assetDecimals)} ${pos.assetSymbol}`
  const shares = (v: bigint) => `${fmt(v, pos.shareDecimals)} shares`

  return (
    <article className="card">
      <header>
        <h3>{vault.name}</h3>
        <a className="mono muted" href={`${explorer}/address/${vault.address}`} target="_blank" rel="noreferrer">
          {vault.address.slice(0, 6)}...{vault.address.slice(-4)}
        </a>
      </header>
      {totalShares > 0n && (
        <p className="value">
          {shares(totalShares)}{" "}
          {pos.walletValue === undefined ? (
            <span className="muted">(value unavailable until the vault's price oracle is back)</span>
          ) : (
            <>
              <span className="muted">worth about</span> {asset(pos.walletValue)}
            </>
          )}
        </p>
      )}

      {vault.kind === "cellar" && pos.walletShares > 0n && <CellarWithdraw pos={pos} user={user} onDone={onDone} />}
      {vault.kind === "boring" && <BoringWithdraw pos={pos} user={user} onDone={onDone} />}

      {pos.stake && pos.stakedShares > 0n && (
        <div className="step">
          <h4>Staked in the SOMM rewards program</h4>
          <p className="muted">
            Staked shares have to come back to your wallet before they can be withdrawn.
            {pos.stake.ended
              ? " The rewards program has been shut down, so you can unstake immediately."
              : " Unstaking starts an unbonding period; once it ends, unstake and then withdraw."}
          </p>
          <ul className="stakes">
            {pos.stake.stakes.map((s) => (
              <li key={s.id}>
                {shares(s.amount)}:{" "}
                {s.unbondTimestamp === 0
                  ? "bonded"
                  : s.unbondTimestamp * 1000 <= Date.now()
                    ? "unbonded, ready to unstake"
                    : `unbonding until ${when(s.unbondTimestamp)}`}
              </li>
            ))}
          </ul>
          {pos.stake.ended ? (
            <Action
              step={{
                label: "Unstake everything now",
                run: () => send(config, { chainId, address: vault.staker!, abi: stakerAbi as Abi, functionName: "emergencyUnstake" }),
              }}
              onDone={onDone}
            />
          ) : pos.stake.paused ? (
            <p className="error">The staking contract is paused; unstaking is unavailable until it is unpaused.</p>
          ) : (
            <div className="row">
              {pos.stake.stakes.some((s) => s.unbondTimestamp === 0) && (
                <Action
                  step={{
                    label: "Start unbonding all",
                    run: () => send(config, { chainId, address: vault.staker!, abi: stakerAbi as Abi, functionName: "unbondAll" }),
                  }}
                  onDone={onDone}
                />
              )}
              {pos.stake.stakes.some((s) => s.unbondTimestamp !== 0 && s.unbondTimestamp * 1000 <= Date.now()) && (
                <Action
                  step={{
                    label: "Unstake unbonded shares",
                    run: () => send(config, { chainId, address: vault.staker!, abi: stakerAbi as Abi, functionName: "unstakeAll" }),
                  }}
                  onDone={onDone}
                />
              )}
            </div>
          )}
        </div>
      )}

      {pos.queueRequestShares > 0n && (
        <div className="step">
          <h4>Open withdraw-queue request</h4>
          <p className="muted">
            You asked the old withdraw queue to sell {shares(pos.queueRequestShares)}. That request does not lock your
            shares or block a direct withdrawal; cancel it if you would rather withdraw yourself.
          </p>
          <Action
            step={{
              label: "Cancel queue request",
              run: () =>
                send(config, {
                  chainId,
                  address: WITHDRAW_QUEUE[chainId],
                  abi: withdrawQueueAbi as Abi,
                  functionName: "updateWithdrawRequest",
                  args: [vault.address, { deadline: 0n, executionSharePrice: 0n, sharesToWithdraw: 0n, inSolve: false }],
                }),
            }}
            onDone={onDone}
          />
        </div>
      )}
    </article>
  )
}

function CellarWithdraw({ pos, user, onDone }: { pos: Position; user: Address; onDone: () => void }) {
  const config = useConfig()
  const { vault } = pos
  const liquid = pos.redeemShares
  const partial = liquid < pos.walletShares
  const totalShares = pos.walletShares + pos.stakedShares
  const liquidValue =
    pos.walletValue !== undefined && totalShares > 0n ? (pos.walletValue * liquid) / totalShares : undefined
  const fmtShares = (v: bigint) => fmt(v, pos.shareDecimals)

  return (
    <div className="step">
      <h4>In your wallet: {fmtShares(pos.walletShares)} shares</h4>
      {partial && liquid > 0n && (
        <p className="warn">
          Only {fmtShares(liquid)} of your {fmtShares(pos.walletShares)} shares can be withdrawn right now. The vault is
          freeing up the rest; come back and withdraw again later.
        </p>
      )}
      {pos.redeemError ? (
        <p className="error">Withdrawal is not available yet: {pos.redeemError}</p>
      ) : (
        <Action
          step={{
            label:
              liquidValue === undefined
                ? `Withdraw ${fmtShares(liquid)} shares`
                : `Withdraw ${fmtShares(liquid)} shares (about ${fmt(liquidValue, pos.assetDecimals)} ${pos.assetSymbol})`,
            run: () =>
              send(config, {
                chainId: vault.chainId,
                address: vault.address,
                abi: cellarAbi as Abi,
                functionName: "redeem",
                args: [liquid, user, user],
              }),
          }}
          disabled={liquid === 0n}
          onDone={onDone}
        />
      )}
    </div>
  )
}

const MIN_DEADLINE = 14 * 24 * 3600

function BoringWithdraw({
  pos,
  user,
  onDone,
  standalone,
}: {
  pos: Position
  user: Address
  onDone: () => void
  standalone?: boolean
}) {
  const config = useConfig()
  const client = usePublicClient({ chainId: 1 })
  const { vault } = pos
  const open = (pos.boring?.assets ?? []).filter((a) => a.allowWithdraws)
  const [assetIdx, setAssetIdx] = useState(0)
  const requests = useQuery({
    queryKey: ["boring-requests", vault.address, user],
    queryFn: () => loadBoringRequests(client!, vault.address, user),
    enabled: !!client,
  })
  const chosen = open[Math.min(assetIdx, open.length - 1)]

  if (standalone && !requests.error && !(requests.data ?? []).length) return null

  const body = (
    <>
      {pos.walletShares > 0n && (
        <div className="step">
          <h4>In your wallet: {fmt(pos.walletShares, 18)} shares</h4>
          <p className="muted">
            Alpha stETH pays out through an on-chain withdraw queue: you submit a request and a solver fills it,
            usually within a few days.
          </p>
          {pos.boring?.paused || open.length === 0 ? (
            <p className="warn">Queue withdrawals are switched off by the vault operator right now. Check back soon.</p>
          ) : (
            <>
              <label className="row">
                Receive
                <select value={assetIdx} onChange={(e) => setAssetIdx(Number(e.target.value))}>
                  {open.map((a, i) => (
                    <option key={a.address} value={i}>
                      {a.symbol} (about {fmt(a.previewOut, a.decimals)})
                    </option>
                  ))}
                </select>
              </label>
              <Action
                step={{
                  label: `Request withdrawal of all shares in ${chosen.symbol}`,
                  run: async () => {
                    const allowance = await client!.readContract({
                      address: vault.address,
                      abi: cellarAbi,
                      functionName: "allowance",
                      args: [user, ALPHA_STETH_QUEUE],
                    })
                    if (allowance < pos.walletShares) {
                      await send(config, {
                        chainId: 1,
                        address: vault.address,
                        abi: cellarAbi as Abi,
                        functionName: "approve",
                        args: [ALPHA_STETH_QUEUE, pos.walletShares],
                      })
                    }
                    return send(config, {
                      chainId: 1,
                      address: ALPHA_STETH_QUEUE,
                      abi: boringQueueAbi as Abi,
                      functionName: "requestOnChainWithdraw",
                      args: [
                        chosen.address,
                        pos.walletShares,
                        chosen.minDiscount,
                        Math.max(chosen.minimumSecondsToDeadline, MIN_DEADLINE),
                      ],
                    })
                  },
                }}
                onDone={() => {
                  onDone()
                  requests.refetch()
                }}
              />
            </>
          )}
        </div>
      )}

      {requests.error && <p className="error">Could not load your queue requests: {(requests.error as Error).message}</p>}
      {(requests.data ?? []).map((r) => (
        <div className="step" key={String(r.nonce)}>
          <h4>Pending queue request</h4>
          <p>
            {fmt(r.amountOfShares, 18)} shares for about {fmt(r.amountOfAssets, 18)}, created {when(r.creationTime)}, expires{" "}
            {when(r.creationTime + r.secondsToMaturity + r.secondsToDeadline)}.
          </p>
          <Action
            step={{
              label: "Cancel request",
              run: () =>
                send(config, {
                  chainId: 1,
                  address: ALPHA_STETH_QUEUE,
                  abi: boringQueueAbi as Abi,
                  functionName: "cancelOnChainWithdraw",
                  args: [r],
                }),
            }}
            onDone={() => {
              onDone()
              requests.refetch()
            }}
          />
        </div>
      ))}
    </>
  )
  if (!standalone) return body
  return (
    <article className="card">
      <header>
        <h3>{vault.name}</h3>
      </header>
      {body}
    </article>
  )
}
