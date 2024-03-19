// keplrUtils.js

export const sommelierChainConfig = {
  chainId: "sommelier-3",
  chainName: "Sommelier",
  rpc: "https://rpc.sommelier.network",
  rest: "https://api.sommelier.network",
  stakeCurrency: {
    coinDenom: "SOMM",
    coinMinimalDenom: "usomm",
    coinDecimals: 6,
    coinGeckoId: "sommelier",
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "somm",
    bech32PrefixAccPub: "somm" + "pub",
    bech32PrefixValAddr: "somm" + "valoper",
    bech32PrefixValPub: "somm" + "valoperpub",
    bech32PrefixConsAddr: "somm" + "valcons",
    bech32PrefixConsPub: "somm" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "SOMM",
      coinMinimalDenom: "usomm",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "SOMM",
      coinMinimalDenom: "usomm",
      coinDecimals: 6,
    },
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
}

export async function suggestSommelierChain() {
  if (!window.keplr) {
    alert("Please install the Keplr extension.")
    return
  }

  try {
    await window.keplr.experimentalSuggestChain(sommelierChainConfig)
    console.log("Sommelier chain suggested to Keplr successfully.")
    await window.keplr.enable(sommelierChainConfig.chainId)
  } catch (error) {
    console.error(
      "Error suggesting the Sommelier chain to Keplr:",
      error
    )
    alert(
      "Failed to suggest the Sommelier chain. See console for details."
    )
  }
}
