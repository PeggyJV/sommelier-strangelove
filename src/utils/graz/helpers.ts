import { useAccount, useOfflineSigners } from "graz"
import { useMemo } from "react"
import { OfflineDirectSigner } from "@cosmjs/proto-signing"
import { OfflineAminoSigner } from "@cosmjs/amino"

/**
 * Custom hook to replace the deprecated useSigners hook
 * Returns signers for the connected wallet
 */
export function useSigners(chainId?: string) {
  const { data: account } = useAccount({ chainId })
  const { data: offlineSigners } = useOfflineSigners({ chainId })

  return useMemo(() => {
    if (!account || !offlineSigners) {
      return {
        signer: undefined,
        signerAmino: undefined,
        signerAuto: undefined,
      }
    }

    return {
      signer: offlineSigners.offlineSigner as OfflineDirectSigner,
      signerAmino: offlineSigners.offlineSignerAmino as OfflineAminoSigner,
      signerAuto: offlineSigners.offlineSignerAuto,
    }
  }, [account, offlineSigners])
}

/**
 * Helper to get the chain ID for Sommelier
 */
export const SOMMELIER_CHAIN_ID = "sommelier-3"

/**
 * Helper to check if a wallet is connected to Sommelier
 */
export function useIsSommelierConnected() {
  const { isConnected } = useAccount({ chainId: SOMMELIER_CHAIN_ID })
  return isConnected
}

/**
 * Helper to get the connected Sommelier account
 */
export function useSommelierAccount() {
  const account = useAccount({ chainId: SOMMELIER_CHAIN_ID })
  return account
}
