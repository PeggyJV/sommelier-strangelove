/**
 * Wallet conflict resolution utilities
 */

import { getSafeEthereumProvider } from "./initOnce"

// Detect multiple wallet extensions
export function hasWalletConflicts(): boolean {
  if (typeof window === "undefined") return false

  const ethereum = getSafeEthereumProvider()
  if (!ethereum) return false

  // Check for multiple wallet providers
  let providerCount = 0

  if (ethereum.isMetaMask) {
    providerCount++
  }

  if (ethereum.isCoinbaseWallet) {
    providerCount++
  }

  if (ethereum.isWalletConnect) {
    providerCount++
  }

  // Check for generic injected wallets that aren't the main ones
  if (
    !ethereum.isMetaMask &&
    !ethereum.isCoinbaseWallet &&
    !ethereum.isWalletConnect
  ) {
    providerCount++
  }

  return providerCount > 1
}

// Get a list of detected wallet providers
export function getDetectedWalletProviders(): string[] {
  if (typeof window === "undefined") return []

  const providers: string[] = []
  const ethereum = getSafeEthereumProvider()

  if (!ethereum) return providers

  if (ethereum.isMetaMask) {
    providers.push("MetaMask")
  }

  if (ethereum.isCoinbaseWallet) {
    providers.push("Coinbase Wallet")
  }

  if (ethereum.isWalletConnect) {
    providers.push("WalletConnect")
  }

  // Check for other injected wallets
  if (
    !ethereum.isMetaMask &&
    !ethereum.isCoinbaseWallet &&
    !ethereum.isWalletConnect
  ) {
    providers.push("Injected Wallet")
  }

  return providers
}

// Determine the recommended wallet provider
export function getRecommendedProvider(): string {
  if (typeof window === "undefined") return "MetaMask"

  const ethereum = getSafeEthereumProvider()
  if (!ethereum) return "MetaMask"

  // Priority order: MetaMask > Coinbase Wallet > WalletConnect > Other
  if (ethereum.isMetaMask) return "MetaMask"
  if (ethereum.isCoinbaseWallet) return "Coinbase Wallet"
  if (ethereum.isWalletConnect) return "WalletConnect"

  return "Injected Wallet"
}

// Generate instructions for resolving conflicts
export function getConflictResolutionInstructions(): string[] {
  const providers = getDetectedWalletProviders()
  const recommended = getRecommendedProvider()

  const instructions = [
    `Multiple wallet extensions detected: ${providers.join(", ")}`,
    `Recommended provider: ${recommended}`,
    "",
    "To resolve conflicts:",
    "1. Disable or remove unused wallet extensions",
    "2. Keep only the wallet extension you want to use",
    "3. Refresh the page after making changes",
    "4. Try connecting again",
  ]

  return instructions
}

// Get debug information about wallet providers
export function getProviderDebugInfo(): any {
  if (typeof window === "undefined") return { error: "Not in browser" }

  try {
    const ethereum = getSafeEthereumProvider()
    if (!ethereum) return { error: "No ethereum provider found" }

    return {
      hasConflicts: hasWalletConflicts(),
      detectedProviders: getDetectedWalletProviders(),
      recommendedProvider: getRecommendedProvider(),
      ethereum: {
        isMetaMask: ethereum.isMetaMask,
        isCoinbaseWallet: ethereum.isCoinbaseWallet,
        isWalletConnect: ethereum.isWalletConnect,
        isConnected: ethereum.isConnected,
        selectedAddress: ethereum.selectedAddress,
        chainId: ethereum.chainId,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Get wallet provider information for debugging
export function getWalletProviderInfo() {
  if (typeof window === "undefined") {
    return {
      ethereum: false,
      isMetaMask: false,
      isCoinbaseWallet: false,
      isWalletConnect: false,
      hasConflicts: false,
      detectedProviders: [],
      recommendedProvider: "MetaMask",
    }
  }

  const ethereum = getSafeEthereumProvider()
  const hasConflicts = hasWalletConflicts()
  const detectedProviders = getDetectedWalletProviders()
  const recommendedProvider = getRecommendedProvider()

  return {
    ethereum: !!ethereum,
    isMetaMask: ethereum?.isMetaMask || false,
    isCoinbaseWallet: ethereum?.isCoinbaseWallet || false,
    isWalletConnect: ethereum?.isWalletConnect || false,
    hasConflicts,
    detectedProviders,
    recommendedProvider,
  }
}
