import { StrategyContracts } from "data/actions/types"
import { ConfigProps } from "data/types"
import { useWalletClient, usePublicClient } from "wagmi"
import { getContract } from "viem"

export const useCreateContracts = (config: ConfigProps) => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chain = config.chain.id


  const stakerSigner = (() => {
    if (!config.staker || !publicClient) return
    // @ts-ignore
    return getContract({
      address: config.staker.address,
      abi: config.staker.abi,
      client: {
        wallet: walletClient
      }
      }
    )
  })()
  // @ts-ignore
  const cellarSigner = getContract({
    address: config.cellar.address,
    abi: config.cellar.abi,
    client: {
      wallet: walletClient
    }
  })!
  const stakerContract = (() => {
    if (!config.staker || !publicClient) return
    // @ts-ignore
    return getContract( {
      address: config.staker.address,
      abi: config.staker.abi,
      client: {
        public: publicClient
      }
      }
    )
  })()
  // @ts-ignore
  const cellarContract = getContract({
    address: config.cellar.address,
    abi: config.cellar.abi,
    client: {
      public: publicClient
    }
  })!
  // @ts-ignore
  const cellarRouterSigner = getContract({
    address: config.cellarRouter.address,
    abi: config.cellarRouter.abi,
    client: {
      wallet: walletClient
    }
  })!

  const contracts: StrategyContracts = {
    stakerSigner,
    cellarSigner,
    stakerContract,
    cellarContract,
    cellarRouterSigner,
    chain,
  }

  return contracts
}
