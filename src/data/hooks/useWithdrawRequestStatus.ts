import { useEffect, useState, useMemo } from "react"
import { useAccount, useChainId, useWalletClient, http } from "wagmi"
import { getAddress, getContract, createPublicClient } from "viem"
import withdrawQueueV0821 from "src/abi/withdraw-queue-v0.8.21.json"
import { useBoringQueueWithdrawals } from "./useBoringQueueWithdrawals"
import { ConfigProps } from "data/types"
import { chainConfig } from "data/chainConfig"
import {
  INFURA_API_KEY,
  ALCHEMY_API_KEY,
} from "src/context/rpc_context"

export const useWithdrawRequestStatus = (
  cellarConfig: ConfigProps
) => {
  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const walletClient = useWalletClient()

  // Create publicClient with configured paid RPC providers
  const publicClient = useMemo(() => {
    const chain = chainConfig.find(
      (c) => c.wagmiId === cellarConfig.chain.wagmiId
    )
    if (!chain) return null

    // Priority: Alchemy > Infura > fallback to public RPC
    let rpcUrl: string | undefined
    if (chain.alchemyRpcUrl && ALCHEMY_API_KEY) {
      rpcUrl = `${chain.alchemyRpcUrl}/${ALCHEMY_API_KEY}`
    } else if (chain.infuraRpcUrl && INFURA_API_KEY) {
      rpcUrl = `${chain.infuraRpcUrl}/${INFURA_API_KEY}`
    }

    return createPublicClient({
      chain: chain.viemChain,
      transport: http(rpcUrl),
    })
  }, [cellarConfig.chain.wagmiId])

  const { data: boringQueueWithdrawals } = useBoringQueueWithdrawals(
    cellarConfig.cellar.address,
    cellarConfig.chain.id,
    { enabled: !!cellarConfig.boringQueue }
  )

  const withdrawQueueContract =
    publicClient &&
    getContract({
      address: getAddress(cellarConfig.chain.withdrawQueueAddress),
      abi: withdrawQueueV0821,
      client: {
        wallet: walletClient?.data,
        public: publicClient,
      },
    })

  useEffect(() => {
    const checkWithdrawRequest = async () => {
      if (chainId !== cellarConfig.chain.wagmiId) return
      try {
        if (
          walletClient &&
          withdrawQueueContract &&
          address &&
          cellarConfig &&
          !boringQueueWithdrawals
        ) {
          const withdrawRequest =
            await withdrawQueueContract.read.getUserWithdrawRequest([
              address,
              cellarConfig.cellar.address,
            ])

          const isWithdrawRequestValid =
            (await withdrawQueueContract.read.isWithdrawRequestValid([
              cellarConfig.cellar.address,
              address,
              withdrawRequest,
            ])) as unknown as boolean

          setIsActiveWithdrawRequest(isWithdrawRequestValid)
        } else if (
          boringQueueWithdrawals &&
          cellarConfig.boringVault &&
          address
        ) {
          setIsActiveWithdrawRequest(
            boringQueueWithdrawals?.open_requests.length > 0
          )
        } else {
          setIsActiveWithdrawRequest(false)
        }
      } catch (error) {
        console.error(error)
        setIsActiveWithdrawRequest(false)
      }
    }

    checkWithdrawRequest()
  }, [
    withdrawQueueContract,
    address,
    cellarConfig,
    boringQueueWithdrawals,
    walletClient,
    chainId,
  ])

  return isActiveWithdrawRequest
}
