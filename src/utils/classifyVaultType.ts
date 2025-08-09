/**
 * Helper function to classify vault type as "legacy" or "new"
 *
 * @param vault - The vault/strategy data object
 * @returns "legacy" or "new"
 */

interface VaultWithProvider {
  deprecated?: boolean
  strategyProvider?: {
    title?: string
  }
}

export function classifyVaultType(
  vault: VaultWithProvider
): "legacy" | "new" {
  // If there's already a deprecated flag, use that for legacy classification
  if (vault.deprecated) {
    return "legacy"
  }

  // Check if strategyProvider title matches known legacy providers
  const providerTitle = vault.strategyProvider?.title
  if (!providerTitle) {
    return "new" // Default to "new" if no provider info
  }

  // Known legacy providers
  const legacyProviders = [
    "Seven Seas",
    "ClearGate",
    "Patache",
    "Silver Sun Capital Investments & Seven Seas", // This is a hybrid but includes Seven Seas
  ]

  // Check if provider is in legacy list
  const isLegacyProvider = legacyProviders.some((legacyProvider) =>
    providerTitle.includes(legacyProvider)
  )

  return isLegacyProvider ? "legacy" : "new"
}
