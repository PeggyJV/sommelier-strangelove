import { config as appConfig } from "utils/config"
import { tokenConfigMap } from "src/data/tokenConfig"

export type StrategyKey = "ALPHA_STETH"

export type ContractRegistry = {
  strategyKey: StrategyKey
  addresses: Set<string>
}

function toLower(addr?: string) {
  return (addr || "").toLowerCase()
}

/**
 * Build a registry of contract addresses we attribute to a given strategy.
 * Auto-discovers from config and allows extension via env.
 */
export function buildAlphaStethRegistry(): ContractRegistry {
  const extrasEnv = (
    process.env.NEXT_PUBLIC_ATTRIBUTION_EXTRA_ADDRESSES ||
    process.env.ATTRIBUTION_EXTRA_ADDRESSES ||
    ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const addresses = new Set<string>()

  // Core Alpha STETH components
  addresses.add(toLower(appConfig.CONTRACT.ALPHA_STETH.ADDRESS))
  addresses.add(
    toLower(appConfig.CONTRACT.ALPHA_STETH_ACCOUNTANT.ADDRESS)
  )
  addresses.add(
    toLower(appConfig.CONTRACT.ALPHA_STETH_TELLER.ADDRESS)
  )
  addresses.add(
    toLower(appConfig.CONTRACT.ALPHA_STETH_BORING_QUEUE.ADDRESS)
  )
  addresses.add(toLower(appConfig.CONTRACT.ALPHA_STETH_LENS.ADDRESS))

  // Deposit assets
  addresses.add(toLower(tokenConfigMap.stETH_ETHEREUM.address))
  addresses.add(toLower(tokenConfigMap.wstETH_ETHEREUM.address))
  addresses.add(toLower(tokenConfigMap.WETH_ETHEREUM.address))

  // Allow custom extensions via env
  for (const e of extrasEnv) addresses.add(toLower(e))

  return { strategyKey: "ALPHA_STETH", addresses }
}

export function isAttributedAddress(
  registry: ContractRegistry,
  address?: string
): boolean {
  if (!address) return false
  return registry.addresses.has(address.toLowerCase())
}
