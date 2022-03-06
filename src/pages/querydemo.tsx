import { useGetWalletQuery } from 'generated/subgraph'

import type { GetWalletQuery } from 'generated/subgraph'

type WalletResult = GetWalletQuery['wallet']

const cellarAddress = '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA'
const walletAddress = '0x02299f744a416bc6482f1f52a861e5826d546d80'

const renderWallet = (wallet: WalletResult) => {
  return <div>{wallet?.id ?? 'Not Found'}</div>
}

const renderLoading = () => <div>Loading...</div>

export default function QueryDemo() {
  const [result] = useGetWalletQuery({
    variables: {
      walletAddress
    }
  })
  const { data: walletData, fetching } = result

  return fetching ? renderLoading() : renderWallet(walletData?.wallet)
}
