export interface CellarDataMap {
  [key: string]: {
    name: string
    description: string
    strategyType: string
    managementFee: string
    protocols: string
    supportedChains: string[]
    performanceSplit: {
      [key: string]: number
    }
  }
}

export const cellarDataMap: CellarDataMap = {
  "0x7a9e1403fbb6c2aa0c180b976f688997e63fda2c": {
    name: "aave2",
    description:
      "The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis.",
    strategyType: "Stablecoin",
    managementFee: "1%",
    protocols: "AAVE",
    supportedChains: [
      "DAI",
      "USDC",
      "USDT",
      "FEI",
      "TUSD",
      "BUSD",
      "GUSD",
    ],
    performanceSplit: {
      "strategy provider": 5,
      protocol: 5,
      depositors: 90,
    },
  },
}
