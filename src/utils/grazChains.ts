import { defineChainInfo } from "graz"

// Define Sommelier chain configuration
export const sommelierChain = defineChainInfo({
  chainId: "sommelier-3",
  chainName: "Sommelier",
  rpc: "https://sommelier-rpc.polkachu.com/",
  rest: "https://sommelier-api.polkachu.com/",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "somm",
    bech32PrefixAccPub: "sommpub",
    bech32PrefixValAddr: "sommvaloper",
    bech32PrefixValPub: "sommvaloperpub",
    bech32PrefixConsAddr: "sommvalcons",
    bech32PrefixConsPub: "sommvalconspub",
  },
  currencies: [
    {
      coinDenom: "SOMM",
      coinMinimalDenom: "usomm",
      coinDecimals: 6,
      coinGeckoId: "sommelier",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "SOMM",
      coinMinimalDenom: "usomm",
      coinDecimals: 6,
      coinGeckoId: "sommelier",
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "SOMM",
    coinMinimalDenom: "usomm",
    coinDecimals: 6,
    coinGeckoId: "sommelier",
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
})

// Helper to get chain decimals
export const getSommelierDecimals = () => {
  return sommelierChain.currencies[0]?.coinDecimals || 6
}

// Export chain ID for convenience
export const SOMMELIER_CHAIN_ID = sommelierChain.chainId
