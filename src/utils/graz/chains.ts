import { ChainInfo } from '@keplr-wallet/types'

export const sommelierChain: ChainInfo = {
  chainId: 'sommelier-3',
  chainName: 'Sommelier',
  rpc: 'https://sommelier-rpc.polkachu.com/',
  rest: 'https://sommelier-api.polkachu.com/',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'somm',
    bech32PrefixAccPub: 'sommpub',
    bech32PrefixValAddr: 'sommvaloper',
    bech32PrefixValPub: 'sommvaloperpub',
    bech32PrefixConsAddr: 'sommvalcons',
    bech32PrefixConsPub: 'sommvalconspub',
  },
  currencies: [
    {
      coinDenom: 'SOMM',
      coinMinimalDenom: 'usomm',
      coinDecimals: 6,
      coinGeckoId: 'sommelier',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'SOMM',
      coinMinimalDenom: 'usomm',
      coinDecimals: 6,
      coinGeckoId: 'sommelier',
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'SOMM',
    coinMinimalDenom: 'usomm',
    coinDecimals: 6,
    coinGeckoId: 'sommelier',
  },
  features: ['stargate', 'ibc-transfer', 'cosmwasm'],
}

// Export a chains object for easy access
export const chains = {
  sommelier: sommelierChain,
}

// Export the chain as default for convenience
export default sommelierChain
