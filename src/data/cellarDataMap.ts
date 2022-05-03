interface CellarDataMap {
  [key: string]: {
    name: string
    description: string
    strategyType: string
    protocols: string
  }
}

export const cellarDataMap: CellarDataMap = {
  "0x7a9e1403fbb6c2aa0c180b976f688997e63fda2c": {
    name: "aave2",
    description:
      "The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis.",
    strategyType: "Stable",
    protocols: "AAVE",
  },
}
