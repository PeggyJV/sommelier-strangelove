/**
 * React hook to interface with CosmWasm and Keplr, partially based on
 * https://github.com/ebaker/next-cosmwasm-keplr-starter/blob/main/hooks/cosmwasm.tsx
 *
 * @example https://github.com/chainapsis/keplr-example/blob/master/src/main.js
 * @see https://github.com/cosmos/chain-registry
 */

import create, { State } from 'zustand'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

// TODO: either fill default values or remove defaults
export const DEFAULT_PUBLIC_CHAIN_ID = ''
export const DEFAULT_PUBLIC_RPC_ENDPOINT = ''

export interface CosmWasmStore extends State {
  error: any
  loading: boolean
  signingClient: SigningCosmWasmClient | null
  walletAddress: string | null

  connect: (chainId?: string, rpcEndpoint?: string) => void | Promise<void>
  disconnect: () => void | Promise<void>
}

export const useCosmWasm = create<CosmWasmStore>((set, get) => ({
  error: null,
  loading: true,
  signingClient: null,
  walletAddress: null,

  connect: async (
    chainId = DEFAULT_PUBLIC_CHAIN_ID,
    rpcEndpoint = DEFAULT_PUBLIC_RPC_ENDPOINT
  ) => {
    try {
      set({ loading: true })
      if (!window.keplr || !window.getOfflineSigner) {
        throw new Error('keplr instance not found')
      }

      await window?.keplr.enable(chainId)

      const offlineSigner = window.getOfflineSigner(chainId)
      const signingClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        offlineSigner
      )
      const [{ address }] = await offlineSigner.getAccounts()

      set({ signingClient, walletAddress: address })
    } catch (error: unknown) {
      console.log(error)
      set({ error })
    } finally {
      set({ loading: false })
    }
  },
  disconnect: async () => {
    const store = get()

    store.signingClient?.disconnect()
    set({
      error: null,
      loading: false,
      signingClient: null,
      walletAddress: null
    })
  }
}))
