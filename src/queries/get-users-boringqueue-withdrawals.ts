const getUrl = (vaultAddress: string, userAddress: string, chain: string) =>
  `/api/users-boringqueue-withdrawals?vaultAddress=${vaultAddress}&userAddress=${userAddress}&chain=${chain}`

export type BoringQueueWithdrawals = {
  open_requests: Request[]
  cancelled_requests: {
    amount: string
    token: string
  }[]
  expired_requests: {
    amount: string
    token: string
  }[]
  fulfilled_requests: {
    amount: string
    token: string
  }[]
}
type Request = {
  amount: number
  blockNumber: number
  metadata: RequestMetadata
  offerToken: string
  timestamp: number
  transaction_hash: string
  user: string
  wantToken: string
  wantTokenDecimals: number
  wantTokenSymbol: string
}

type RequestMetadata = {
  amountOfAssets: number
  amountOfShares: number
  assetOut: string
  creationTime: number
  nonce: number
  secondsToDeadline: number
  secondsToMaturity: number
  user: string
}

const fetchUsersBoringQueueWithdrawals = async (vaultAddress: string, userAddress: string, chain: string): Promise<BoringQueueWithdrawals> => {
  const url = getUrl(vaultAddress, userAddress, chain)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.result.data
  } catch (error) {
    console.log("Error fetching Users Boring Queue Withdrawals", error)
    throw Error(error as string)
  }
}

export default fetchUsersBoringQueueWithdrawals
