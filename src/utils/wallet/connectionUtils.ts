/**
 * Wallet connection utility functions
 */
import { getSafeEthereumProvider } from "./initOnce"

// Check if there's a pending wallet request
export function hasPendingWalletRequest(): boolean {
  if (typeof window === "undefined") return false

  // Check if ethereum provider exists and has pending requests
  const ethereum = getSafeEthereumProvider()
  if (ethereum) {
    // This is a heuristic - we can't directly check pending requests
    // but we can check if the provider is in a connecting state
    return false // Default to false, will be handled by error catching
  }

  return false
}

// Wait for wallet to be ready
export function waitForWalletReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve()
      return
    }

    const ethereum = getSafeEthereumProvider()
    if (ethereum) {
      resolve()
      return
    }

    // Wait for ethereum provider to be injected
    const checkEthereum = () => {
      const provider = getSafeEthereumProvider()
      if (provider) {
        resolve()
      } else {
        setTimeout(checkEthereum, 100)
      }
    }

    checkEthereum()
  })
}

// Safe wallet connection with retry logic
export async function safeWalletConnect(
  connectFn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await waitForWalletReady()
      return await connectFn()
    } catch (error) {
      lastError = error as Error

      // If it's a permission pending error, don't retry
      if (
        error instanceof Error &&
        error.message?.includes("wallet_requestPermissions") &&
        error.message?.includes("already pending")
      ) {
        throw error
      }

      // If it's a provider conflict error, don't retry
      if (
        error instanceof Error &&
        error.message?.includes("Cannot set property ethereum")
      ) {
        throw error
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * attempt)
        )
      }
    }
  }

  throw (
    lastError ||
    new Error("Wallet connection failed after all retries")
  )
}

// Check if wallet is supported
export function isWalletSupported(walletName: string): boolean {
  if (typeof window === "undefined") return false

  const walletNameLower = walletName.toLowerCase()

  // Check for MetaMask
  if (walletNameLower === "metamask") {
    const ethereum = getSafeEthereumProvider()
    return !!ethereum?.isMetaMask
  }

  // For other wallets, check if ethereum provider exists
  if (walletNameLower === "walletconnect" || walletNameLower === "coinbase") {
    const ethereum = getSafeEthereumProvider()
    return !!ethereum
  }

  return false
}

// Get available wallet providers
export function getAvailableWalletProviders(): string[] {
  if (typeof window === "undefined") return []

  const providers: string[] = []
  const ethereum = getSafeEthereumProvider()

  if (ethereum) {
    if (ethereum.isMetaMask) providers.push("MetaMask")
    if (ethereum.isCoinbaseWallet) providers.push("Coinbase Wallet")
    if (ethereum.isWalletConnect) providers.push("WalletConnect")
  }

  return providers
}

// Get recommended wallet provider
export function getRecommendedWalletProvider(): string | null {
  if (typeof window === "undefined") return null

  const ethereum = getSafeEthereumProvider()
  if (!ethereum) return null

  // Priority order: MetaMask > Coinbase Wallet > WalletConnect
  if (ethereum.isMetaMask) return "MetaMask"
  if (ethereum.isCoinbaseWallet) return "Coinbase Wallet"
  if (ethereum.isWalletConnect) return "WalletConnect"

  return null
}
