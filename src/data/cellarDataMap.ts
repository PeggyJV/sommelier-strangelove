interface CellarDataMap {
  [key: string]: {
    name: string
    description: string
    strategyType: string
    protocols: string
  }
}

export const cellarDataMap: CellarDataMap = {
  "0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA": {
    name: "aave2",
    description:
      "The Aave stablecoin strategy aims to select the optimal stablecoin lending position available to lend across Aave markets on a continuous basis.",
    strategyType: "Stable",
    protocols: "AAVE",
  },
}
