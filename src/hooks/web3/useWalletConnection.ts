import { useRef, useCallback, useEffect, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import type { Connector } from "wagmi"
import { useBrandedToast } from "hooks/chakra"

export const useWalletConnection = () => {
  const { addToast } = useBrandedToast()
  const abortRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { connect, isPending } = useConnect()
  const { isConnected } = useAccount()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Monitor connection state changes and manage AbortController
  useEffect(() => {
    if (isPending && !isConnecting) {
      // Connection started - create AbortController
      setIsConnecting(true)
      abortRef.current?.abort() // Abort any existing connection
      abortRef.current = new AbortController()

      // Set 30s timeout as fallback
      timeoutRef.current = setTimeout(() => {
        if (abortRef.current) {
          abortRef.current.abort()
          addToast({
            heading: "Connection Timeout",
            body: "Connection request timed out. Please try again.",
            status: "error",
          })
        }
      }, 30000)
    } else if (!isPending && isConnecting) {
      // Connection finished (success or failure)
      setIsConnecting(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isPending, isConnecting, addToast])

  // Reset connecting state when wallet connects
  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false)
    }
  }, [isConnected])

  // Function to cancel current connection
  const cancelConnection = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      addToast({
        heading: "Connection Cancelled",
        body: "Wallet connection was cancelled.",
        status: "info",
      })
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsConnecting(false)
  }, [addToast])

  // Advanced connection handler with AbortController support
  const handleConnectWithAbort = useCallback(
    async (connector: Connector) => {
      if (isConnecting) return

      setIsConnecting(true)
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      const timer = setTimeout(() => {
        abortRef.current?.abort()
        addToast({
          heading: "Connection Timeout",
          body: "Connection request timed out. Please try again.",
          status: "error",
        })
      }, 30000)

      try {
        await connect({ connector })

        // Clear timeout on successful connection
        clearTimeout(timer)
      } catch (e: unknown) {
        const error = e as {
          name?: string
          message?: string
        }
        if (
          error.name === "AbortError" ||
          abortRef.current?.signal.aborted
        ) {
          addToast({
            heading: "Connection Cancelled",
            body: "Connection canceled. Try again.",
            status: "info",
          })
        } else {
          // Handle specific wallet permission pending error
          if (
            error.message?.includes("wallet_requestPermissions") &&
            error.message?.includes("already pending")
          ) {
            addToast({
              heading: "Connection in Progress",
              body: "Please complete the wallet connection in your wallet extension. If the issue persists, try refreshing the page.",
              status: "warning",
            })
          } else {
            addToast({
              heading: "Connection Failed",
              body: error.message || "Failed to connect wallet",
              status: "error",
            })
          }
        }
      } finally {
        clearTimeout(timer)
        setIsConnecting(false)
      }
    },
    [isConnecting, connect, addToast]
  )

  return {
    isConnecting,
    cancelConnection,
    handleConnectWithAbort,
    abortController: abortRef.current,
  }
}
