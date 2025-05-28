import { useEffect, useState, useRef } from "react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { getAddress, getContract } from "viem"
import withdrawQueueV0821 from "src/abi/withdraw-queue-v0.8.21.json"
import { useBoringQueueWithdrawals } from "./useBoringQueueWithdrawals"
import { ConfigProps } from "data/types"

export const useWithdrawRequestStatus = (
  cellarConfig: ConfigProps
) => {
  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)
  const isMounted = useRef(true)
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

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
        wallet: walletClient,
        public: publicClient,
      },
    })

  useEffect(() => {
    const checkWithdrawRequest = async () => {
      try {
        if (
          walletClient &&
          withdrawQueueContract &&
          address &&
          cellarConfig &&
          !boringQueueWithdrawals
        ) {
          // @ts-ignore
          const withdrawRequest =
            await withdrawQueueContract?.read.getUserWithdrawRequest([
              address,
              cellarConfig.cellar.address,
            ])

          const isWithdrawRequestValid =
            (await withdrawQueueContract?.read.isWithdrawRequestValid(
              [cellarConfig.cellar.address, address, withdrawRequest]
            )) as unknown as boolean

          if (isMounted.current) {
            setIsActiveWithdrawRequest(isWithdrawRequestValid)
          }
        } else if (
          boringQueueWithdrawals &&
          cellarConfig.boringVault &&
          address
        ) {
          if (isMounted.current) {
            setIsActiveWithdrawRequest(
              boringQueueWithdrawals?.open_requests.length > 0
            )
          }
        } else if (isMounted.current) {
          setIsActiveWithdrawRequest(false)
        }
      } catch (error) {
        console.log(error)
        if (isMounted.current) {
          setIsActiveWithdrawRequest(false)
        }
      }
    }

    checkWithdrawRequest()

    return () => {
      isMounted.current = false
    }
  }, [
    withdrawQueueContract,
    address,
    cellarConfig,
    boringQueueWithdrawals,
    walletClient,
  ])

  return isActiveWithdrawRequest
}
