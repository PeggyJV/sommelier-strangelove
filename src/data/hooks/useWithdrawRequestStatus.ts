import { useEffect, useState } from "react"
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
  ])

  return isActiveWithdrawRequest
}
