export interface Token {
  src: string
  alt: string
  symbol: string
  address: string
  coinGeckoId: string
  decimals: number
}

/**
 *
 *  tokenConfig is for storing the all token data that used in the app
 */
export const tokenConfig: Token[] = [
  {
    src: "/assets/icons/eth.png",
    alt: "Ethereum logo",
    symbol: "WETH",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    coinGeckoId: "weth",
    decimals: 18,
  },
  {
    src: "/assets/icons/wbtc.png",
    alt: "Bitcoin logo",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    coinGeckoId: "wrapped-bitcoin",
    decimals: 8,
  },
  {
    src: "/assets/icons/usdc.png",
    alt: "USD Coin logo",
    symbol: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    coinGeckoId: "usd-coin",
    decimals: 6,
  },
  {
    src: "/assets/icons/ampl.png",
    alt: "Ampleforth logo",
    symbol: "AMPL",
    address: "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
    coinGeckoId: "ampleforth",
    decimals: 9,
  },
  {
    src: "/assets/icons/busd.png",
    alt: "Binance USD logo",
    symbol: "BUSD",
    address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    coinGeckoId: "binance-usd",
    decimals: 18,
  },
  {
    src: "/assets/icons/dai.png",
    alt: "Dai logo",
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    coinGeckoId: "dai",
    decimals: 18,
  },
  {
    src: "/assets/icons/frax.png",
    alt: "Frax logo",
    symbol: "FRAX",
    address: "0x853d955acef822db058eb8505911ed77f175b99e",
    coinGeckoId: "frax",
    decimals: 18,
  },
  {
    src: "/assets/icons/gusd.png",
    alt: "Gemini Dollar logo",
    symbol: "GUSD",
    address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
    coinGeckoId: "gemini-dollar",
    decimals: 2,
  },
  {
    src: "/assets/icons/usdp.png",
    alt: "Pax Dollar logo",
    symbol: "USDP",
    address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
    coinGeckoId: "pax-dollar",
    decimals: 18,
  },
  {
    src: "/assets/icons/rai.png",
    alt: "Rai Reflex Index logo",
    symbol: "RAI",
    address: "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
    coinGeckoId: "rai",
    decimals: 18,
  },
  {
    src: "/assets/icons/susd.png",
    alt: "sUSD logo",
    symbol: "sUSD",
    address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
    coinGeckoId: "susd",
    decimals: 18,
  },
  {
    src: "/assets/icons/tusd.png",
    alt: "TrueUSD logo",
    symbol: "TUSD",
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    coinGeckoId: "true-usd",
    decimals: 18,
  },
  {
    src: "/assets/icons/usdt.png",
    alt: "Tether logo",
    symbol: "USDT",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    coinGeckoId: "tether",
    decimals: 6,
  },
  {
    src: "/assets/icons/uniswap.png",
    alt: "Uniswap logo",
    symbol: "UNI",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    coinGeckoId: "uniswap",
    decimals: 18,
  },
  {
    src: "/assets/icons/matic.png",
    alt: "Matic logo",
    symbol: "MATIC",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    coinGeckoId: "matic-network",
    decimals: 18,
  },
  {
    src: "/assets/icons/cbETH.png",
    alt: "cbETH logo",
    symbol: "cbETH",
    address: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
    coinGeckoId: "coinbase-wrapped-staked-eth",
    decimals: 18,
  },
  {
    src: "/assets/icons/rETH.png",
    alt: "rETH logo",
    symbol: "rETH",
    address: "0xae78736cd615f374d3085123a210448e74fc6393",
    coinGeckoId: "rocket-pool-eth",
    decimals: 18,
  },
  {
    src: "/assets/icons/stETH.png",
    alt: "stETH logo",
    symbol: "stETH",
    address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    coinGeckoId: "staked-ether",
    decimals: 18,
  },
  {
    src: "/assets/icons/comp.png",
    alt: "COMP logo",
    symbol: "COMP",
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    coinGeckoId: "compound-governance-token",
    decimals: 18,
  },
  {
    src: "/assets/icons/crv.png",
    alt: "CRV logo",
    symbol: "CRV",
    address: "0xd533a949740bb3306d119cc777fa900ba034cd52",
    coinGeckoId: "curve-dao-token",
    decimals: 18,
  },
  {
    src: "/assets/icons/ldo.png",
    alt: "LDO logo",
    symbol: "LDO",
    address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
    coinGeckoId: "lido-dao",
    decimals: 18,
  },
  {
    src: "/assets/icons/mkr.png",
    alt: "MKR logo",
    symbol: "MKR",
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    coinGeckoId: "maker",
    decimals: 18,
  },
  {
    src: "/assets/icons/aave.png",
    alt: "AAVE logo",
    symbol: "AAVE",
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    coinGeckoId: "aave",
    decimals: 18,
  },
  {
    src: "/assets/icons/chainlink.png",
    alt: "LINK logo",
    symbol: "LINK",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    coinGeckoId: "chainlink",
    decimals: 18,
  },
  {
    src: "/assets/icons/one-inch.png",
    alt: "1Inch logo",
    symbol: "1INCH",
    address: "0x111111111117dc0aa78b770fa6a738034120c302",
    coinGeckoId: "1inch",
    decimals: 18,
  },
  {
    src: "/assets/icons/ens.png",
    alt: "Ens logo",
    symbol: "ENS",
    address: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
    coinGeckoId: "ethereum-name-service",
    decimals: 18,
  },
  {
    src: "/assets/icons/snx.png",
    alt: "SNX logo",
    symbol: "SNX",
    address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    coinGeckoId: "havven",
    decimals: 18,
  },
  {
    src: "/assets/icons/real-yield-eth.png",
    alt: "real-yield-eth logo",
    symbol: "YieldETH",
    address: "0xb5b29320d2dde5ba5bafa1ebcd270052070483ec",
    coinGeckoId: "y-eth",
    decimals: 18,
  },
  {
    src: "/assets/icons/sweth.png",
    alt: "swETH logo",
    symbol: "swETH",
    address: "0xf951e335afb289353dc249e82926178eac7ded78",
    coinGeckoId: "sweth",
    decimals: 18,
  },
  {
    src: "/assets/icons/gho.png",
    alt: "GHO logo",
    symbol: "GHO",
    address: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
    coinGeckoId: "gho",
    decimals: 18,
  },
  {
    src: "/assets/icons/liquity-usd-logo.png",
    alt: "LUSD logo",
    symbol: "LUSD",
    address: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
    coinGeckoId: "liquity-usd",
    decimals: 18,
  },
]

// Creatae a map from each token symbol to its config
export const tokenConfigMap = tokenConfig.reduce((map, token) => {
  map[token.symbol] = token
  return map
}, {} as { [symbol: string]: Token })

export const depositAssetTokenList = [
  "USDC",
  "AMPL",
  "BUSD",
  "DAI",
  "FRAX",
  "GUSD",
  "USDP",
  "RAI",
  "sUSD",
  "TUSD",
  "USDT",
]

export const depositAssetTokenConfig: Token[] = tokenConfig.filter(
  (token) => depositAssetTokenList.includes(token.symbol)
)

export function getTokenConfig(tokenList: string[]) {
  return tokenList.map((list) =>
    tokenConfig.find((token) => token.symbol === list)
  )
}
