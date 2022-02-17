/**
 * React hook to interface with CosmWasm and Keplr, partially based on
 * https://github.com/ebaker/next-cosmwasm-keplr-starter/blob/main/hooks/cosmwasm.tsx
 *
 * @example https://github.com/chainapsis/keplr-example/blob/master/src/main.js
 * @see https://github.com/cosmos/chain-registry
 */

import create, { State } from 'zustand'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useEffect } from 'react'

// TODO: either fill default values or remove defaults
export const DEFAULT_PUBLIC_CHAIN_ID = ''
export const DEFAULT_PUBLIC_RPC_ENDPOINT = ''

/**
 * useCosmWasm store types, includes method to connect/disconnect and previous
 * connected chainId and rpcEndpoint
 *
 * @see https://github.com/cosmos/cosmjs/tree/main/packages/stargate
 */
export interface CosmWasmStore extends State {
  error: any
  isLoading: boolean
  isSupported: boolean
  signingClient: SigningCosmWasmClient | null
  walletAddress: string | null

  _chainId?: string
  _rpcEndpoint?: string

  connect: (chainId?: string, rpcEndpoint?: string) => void | Promise<void>
  disconnect: () => void | Promise<void>
}

/**
 * Main store hook for {@link useCosmWasm} (only directly use this for
 * advanced use cases, e.g. directly mutate states or subscribing effects)
 *
 * @see {@link useCosmWasm}
 */
export const useCosmWasmStore = create<CosmWasmStore>((set, get) => ({
  error: null,
  isLoading: false,
  isSupported: false,
  signingClient: null,
  walletAddress: null,

  connect: async (
    chainId = DEFAULT_PUBLIC_CHAIN_ID,
    rpcEndpoint = DEFAULT_PUBLIC_RPC_ENDPOINT
  ) => {
    try {
      set({ isLoading: true })
      if (!window.keplr || !window.getOfflineSigner) {
        throw new Error('keplr instance not found')
      }

      await window.keplr.enable(chainId)

      const offlineSigner = window.getOfflineSigner(chainId)
      const signingClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        offlineSigner
      )
      const [{ address }] = await offlineSigner.getAccounts()

      set({
        signingClient,
        walletAddress: address,
        _chainId: chainId,
        _rpcEndpoint: rpcEndpoint
      })
    } catch (error: unknown) {
      console.log(error)
      set({ error })
    } finally {
      set({ isLoading: false })
    }
  },
  disconnect: async () => {
    const store = get()

    store.signingClient?.disconnect()
    set({
      error: null,
      isLoading: false,
      signingClient: null,
      walletAddress: null
    })
  }
}))

/**
 * Main store hook with side effect checking supported state (for advanced use
 * cases, use the main store {@link useCosmWasmStore})
 *
 * @see {@link useCosmWasmStore}
 */
export const useCosmWasm = () => {
  useEffect(() => {
    useCosmWasmStore.setState({
      isSupported: Boolean(window.keplr)
    })
  }, [])
  return useCosmWasmStore()
}
