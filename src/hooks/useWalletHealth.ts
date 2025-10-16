import { useMemo } from "react"
import { ALCHEMY_API_KEY, INFURA_API_KEY } from "context/rpc_context"

export interface WalletHealth {
  healthy: boolean
  issues: string[]
}

export function useWalletHealth(): WalletHealth {
  return useMemo(() => {
    const issues: string[] = []

    // Check for WalletConnect project ID
    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      issues.push("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID")
    }

    // Check for at least one transport (RPC endpoint)
    const hasAlchemy = !!ALCHEMY_API_KEY
    const hasInfura = !!INFURA_API_KEY

    if (!hasAlchemy && !hasInfura) {
      issues.push(
        "No RPC transport configured (missing ALCHEMY_API_KEY and INFURA_API_KEY)"
      )
    }

    // Check for valid environment
    if (process.env.NODE_ENV === "development") {
      // Additional dev-only checks
      if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
        issues.push(
          "WalletConnect will not be available without project ID"
        )
      }

      if (!hasAlchemy && !hasInfura) {
        issues.push(
          "RPC endpoints not configured - some features may not work"
        )
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
    }
  }, [])
}
