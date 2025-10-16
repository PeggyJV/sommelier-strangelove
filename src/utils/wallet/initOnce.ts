let __wc_inited = false
let __ethereum_provider_set = false

export function initWalletCoreOnce(init: () => void) {
  if (typeof window === "undefined") return
  if (__wc_inited) return
  __wc_inited = true
  try {
    init()
  } catch {
    // swallow to prevent crashing on hot reloads
  }
}

// Check if ethereum provider is already set
export function isEthereumProviderSet(): boolean {
  if (typeof window === "undefined") return false
  return __ethereum_provider_set || !!getSafeEthereumProvider()
}

// Mark ethereum provider as set
export function markEthereumProviderSet() {
  if (typeof window === "undefined") return
  __ethereum_provider_set = true
}

// Clear any pending wallet requests
export function clearPendingWalletRequests() {
  if (typeof window === "undefined") return

  // Clear any pending ethereum requests
  const ethereum = getSafeEthereumProvider()
  if (ethereum) {
    // Remove any pending listeners
    ethereum.removeAllListeners?.()

    // Clear any pending requests by reconnecting
    try {
      // This will clear any pending permission requests
      if (ethereum.request) {
        // Force clear any pending requests by making a simple request
        ethereum
          .request({ method: "eth_accounts" })
          .catch(() => {
            // Ignore errors from this cleanup request
          })

        // Also try to clear any pending permission requests
        ethereum
          .request({
            method: "wallet_requestPermissions",
            params: [],
          })
          .catch(() => {
            // Ignore errors from this cleanup request
          })
      }
    } catch (error) {
      console.warn("Error clearing pending wallet requests:", error)
    }
  }
}

// More aggressive wallet cleanup
export function forceClearWalletState() {
  if (typeof window === "undefined") return

  // Clear any pending ethereum requests
  const ethereum = getSafeEthereumProvider()
  if (ethereum) {
    try {
      // Remove all listeners
      ethereum.removeAllListeners?.()

      // Clear any stored state
      if (ethereum.request) {
        // Try multiple methods to clear pending state
        const cleanupMethods = [
          { method: "eth_accounts" },
          { method: "eth_chainId" },
          { method: "wallet_requestPermissions", params: [] },
        ]

        cleanupMethods.forEach((params) => {
          ethereum.request(params).catch(() => {
            // Ignore all cleanup errors
          })
        })
      }
    } catch (error) {
      console.warn("Error in force clear wallet state:", error)
    }
  }

  // Clear any localStorage wallet state
  try {
    const keysToRemove = Object.keys(localStorage).filter(
      (key) =>
        key.includes("wallet") ||
        key.includes("wagmi") ||
        key.includes("connect")
    )
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.warn("Error clearing localStorage:", error)
  }
}

// Reset wallet connection state
export function resetWalletConnection() {
  clearPendingWalletRequests()
  forceClearWalletState()
  __wc_inited = false
  __ethereum_provider_set = false
}

// Safe ethereum provider check
export function getSafeEthereumProvider() {
  if (typeof window === "undefined") return null

  // Check if ethereum is already available
  if (window.ethereum) {
    return window.ethereum
  }

  // Wait for ethereum provider to be injected
  return new Promise((resolve) => {
    const checkEthereum = () => {
      if (window.ethereum) {
        resolve(window.ethereum)
      } else {
        setTimeout(checkEthereum, 100)
      }
    }
    checkEthereum()
  })
}
