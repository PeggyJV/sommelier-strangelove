import { BaseError, ContractFunctionRevertedError, type Abi, type Address } from "viem"
import type { Config } from "wagmi"
import { getAccount, simulateContract, switchChain, waitForTransactionReceipt, writeContract } from "wagmi/actions"

type Call = {
  chainId: 1 | 10 | 42161
  address: Address
  abi: Abi
  functionName: string
  args?: readonly unknown[]
}

// Switch to the vault's chain, simulate, send, and wait for one confirmation.
// Simulating first means a revert shows its reason instead of a wallet gas error.
export async function send(config: Config, call: Call): Promise<`0x${string}`> {
  const account = getAccount(config)
  if (!account.address) throw new Error("Connect a wallet first")
  if (account.chainId !== call.chainId) await switchChain(config, { chainId: call.chainId })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { request } = await simulateContract(config, { ...(call as any), account: account.address })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hash = await writeContract(config, request as any)
  const receipt = await waitForTransactionReceipt(config, { hash, chainId: call.chainId })
  if (receipt.status !== "success") throw new Error(`Transaction ${hash} reverted`)
  return hash
}

const FRIENDLY: Record<string, string> = {
  Cellar__OracleFailure: "The vault's share price oracle is not reporting. It is being restored; try again later.",
  Cellar__IlliquidWithdraw: "The vault does not have enough liquid assets for this amount right now.",
  Cellar__IncompleteWithdraw: "The vault does not have enough liquid assets for this amount right now.",
  Cellar__Paused: "The vault is paused.",
  Cellar__SharesAreLocked: "These shares are still inside their post-deposit lock period.",
  Cellar__ZeroAssets: "This amount is too small to withdraw.",
  STATE_ContractPaused: "The contract is paused.",
  CellarStaking__ContractPaused: "The staking contract is paused.",
  STATE_ContractKilled: "The rewards program has been shut down; use the emergency unstake instead.",
  CellarStaking__ContractKilled: "The rewards program has been shut down; use the emergency unstake instead.",
  USR_StakeLocked: "That stake is still unbonding.",
  CellarStaking__StakeLocked: "That stake is still unbonding.",
}

// Turn a viem error into one readable line, naming the contract's custom error when it has one.
export function errorText(e: unknown): string {
  const err = e as BaseError
  const reverted = typeof err?.walk === "function" ? err.walk((x) => x instanceof ContractFunctionRevertedError) : null
  if (reverted instanceof ContractFunctionRevertedError) {
    const name = reverted.data?.errorName ?? reverted.reason
    if (name && FRIENDLY[name]) return FRIENDLY[name]
    if (name) return reverted.data?.args?.length ? `${name}(${reverted.data.args.map(String).join(", ")})` : name
    if (reverted.signature) return `reverted with unknown error ${reverted.signature}`
  }
  const msg = ((e as { shortMessage?: string; message?: string })?.shortMessage || (e as Error)?.message || String(e)).split("\n")[0]
  if (/user rejected|user denied/i.test(msg)) return "Cancelled in wallet"
  return msg
}
