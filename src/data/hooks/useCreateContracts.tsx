import { ConfigProps } from "data/types"
import { useWalletClient, usePublicClient } from "wagmi"
import { getContract } from "viem"

export const useCreateContracts = (config: ConfigProps) => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chain = config.chain.id


  const stakerSigner = (() => {
    if (!config.staker || !publicClient) return
    return getContract({
      address: config.staker.address as `0x${string}`,
      abi: config.staker.abi,
      client: {
        wallet: walletClient,
        public: publicClient
      }
      }
    )
  })()

  const cellarSigner = (() => {
    if (!publicClient) return
    return getContract( {
        address: config.cellar.address as `0x${string}`,
        abi: config.cellar.abi,
        client: {
          wallet: walletClient,
          public: publicClient
        }
      }
    )
  })()
  const stakerContract = (() => {
    if (!config.staker || !publicClient) return
    return getContract( {
      address: config.staker.address as `0x${string}`,
      abi: config.staker.abi,
      client: {
        public: publicClient
      }
      }
    )
  })()

  const cellarContract = (() => {
    if (!publicClient) return
    return getContract( {
        address: config.cellar.address as `0x${string}`,
        abi: config.cellar.abi,
        client: {
          public: publicClient
        }
      }
    )
  })()

  const cellarRouterSigner = (() => {
    if (!publicClient) return
    return getContract( {
        address: config.cellarRouter.address as `0x${string}`,
        abi: config.cellarRouter.abi,
        client: {
          public: publicClient,
          wallet: walletClient
        }
      }
    )
  })()

  const contracts = {
    stakerSigner,
    cellarSigner,
    stakerContract,
    cellarContract,
    cellarRouterSigner,
    chain,
  }

  return contracts
}
