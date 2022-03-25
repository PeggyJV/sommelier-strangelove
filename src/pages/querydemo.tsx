import { BigNumber } from '@ethersproject/bignumber'
import { useGetCellarQuery, useGetPositionQuery } from 'generated/subgraph'

import type { GetCellarQuery, GetPositionQuery } from 'generated/subgraph'

type CellarResult = GetCellarQuery['cellar']
type DayData = NonNullable<CellarResult>['dayDatas'][0]
type WalletResult = GetPositionQuery['wallet']

const cellarAddress = '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA'
const walletAddress = '0x02299f744a416bc6482f1f52a861e5826d546d80'

const renderCellar = (cellar: CellarResult) => {
  if (cellar == null) {
    return <div>Cellar: Not Found</div>
  }

  const renderDay = (day: DayData) => {
    const added = BigNumber.from(day.addedLiquidity)
    const removed = BigNumber.from(day.removedLiquidity)
    const date = new Date(day.date * 1000).toISOString()

    return (
      <div key={cellar.id + date}>
        <div>Date: {date}</div>
        <div>Volume: {added.sub(removed).toString()}</div>
        <div>Wallets: {day.numWallets}</div>
      </div>
    )
  }

  return (
    <div>
      <div>Cellar: {cellar.id}</div>
      <div>Value Managed: {cellar.tvlTotal}</div>
      <div>Depositors: {cellar.numWalletsActive}</div>
      <br></br>
      <div>7 day activity</div>
      {cellar.dayDatas.map(renderDay)}
    </div>
  )
}

const render = (wallet: WalletResult, cellar: CellarResult) => {
  return (
    <div>
      <div>User: {wallet?.id ?? 'Not Found'}</div>
      <div>
        Principal: {wallet?.cellarShares[0]?.balance ?? 'Not invested'}{' '}
        {cellar?.denom.symbol ?? ''}
      </div>
      <br></br>
      {renderCellar(cellar)}
    </div>
  )
}

const renderLoading = () => <div>Loading...</div>

export default function QueryDemo() {
  const [walletResult] = useGetPositionQuery({
    variables: {
      walletAddress,
      cellarAddress
    }
  })
  const { data: walletData, fetching: walletFetching } = walletResult

  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress,
      cellarString: cellarAddress
    }
  })
  const { data: cellarData, fetching: cellarFetching } = cellarResult

  return walletFetching || cellarFetching
    ? renderLoading()
    : render(walletData?.wallet, cellarData?.cellar)
}
