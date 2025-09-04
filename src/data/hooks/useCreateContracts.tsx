import { ConfigProps } from "data/types"
import { useWalletClient, useAccount, http } from "wagmi"
import { getContract, createPublicClient } from "viem"
import { useMemo } from "react"
import { chainConfig } from "data/chainConfig"
import {
  INFURA_API_KEY,
  ALCHEMY_API_KEY,
} from "src/context/rpc_context"

export const useCreateContracts = (config: ConfigProps) => {
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const chain = config.chain.id

  // Create publicClient with configured paid RPC providers
  const publicClient = useMemo(() => {
    const chainObj = chainConfig.find(
      (c) => c.wagmiId === config.chain.wagmiId
    )
    if (!chainObj) return null

    // Priority: Alchemy > Infura > fallback to public RPC
    let rpcUrl: string | undefined
    if (chainObj.alchemyRpcUrl && ALCHEMY_API_KEY) {
      rpcUrl = `${chainObj.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
    } else if (chainObj.infuraRpcUrl && INFURA_API_KEY) {
      rpcUrl = `${chainObj.infuraRpcUrl}/${INFURA_API_KEY}`
    }

    return createPublicClient({
      chain: chainObj.viemChain,
      transport: http(rpcUrl),
    })
  }, [config.chain.wagmiId])

  const stakerSigner = (() => {
    if (!config.staker || !publicClient || !isConnected) return
    return getContract({
      address: config.staker.address as `0x${string}`,
      abi: config.staker.abi,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })
  })()

  const cellarSigner = (() => {
    if (!publicClient || !isConnected) return
    if (config.teller) {
      // Using Teller contracts as signers for BoringVault
      return getContract({
        address: config.teller?.address as `0x${string}`,
        abi: config.teller?.abi,
        client: {
          wallet: walletClient,
          public: publicClient,
        },
      })
    }
    return getContract({
      address: config.cellar.address as `0x${string}`,
      abi: config.cellar.abi,
      client: {
        wallet: walletClient,
        public: publicClient,
      },
    })
  })()
  const stakerContract = (() => {
    if (!config.staker || !publicClient) return
    return getContract({
      address: config.staker.address as `0x${string}`,
      abi: config.staker.abi,
      client: {
        public: publicClient,
      },
    })
  })()

  const cellarContract = (() => {
    if (!publicClient) return
    return getContract({
      address: config.cellar.address as `0x${string}`,
      abi: config.cellar.abi,
      client: {
        public: publicClient,
      },
    })
  })()

  const cellarRouterSigner = (() => {
    if (!publicClient || !config.cellarRouter || !isConnected) return
    return getContract({
      address: config.cellarRouter.address as `0x${string}`,
      abi: config.cellarRouter.abi,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    })
  })()

  const boringVaultLens = (() => {
    if (!publicClient || !config.lens) return
    return getContract({
      address: config.lens.address as `0x${string}`,
      abi: config.lens.abi,
      client: {
        public: publicClient,
        // read-only is fine here; no wallet required
      },
    })
  })()

  const boringQueue = (() => {
    if (!publicClient || !config.boringQueue) return
    return getContract({
      address: config.boringQueue.address as `0x${string}`,
      abi: config.boringQueue.abi,
      client: {
        public: publicClient,
        wallet: isConnected ? walletClient : undefined,
      },
    })
  })()

  const contracts = {
    stakerSigner,
    cellarSigner,
    stakerContract,
    cellarContract,
    cellarRouterSigner,
    boringVaultLens,
    boringQueue,
    chain,
  }

  return contracts
}
