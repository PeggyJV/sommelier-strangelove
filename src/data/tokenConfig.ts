export interface Token {
  src: string
  alt: string
  symbol: string
  address: string
  coinGeckoId: string
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
  },
  {
    src: "/assets/icons/btc.png",
    alt: "Bitcoin logo",
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    coinGeckoId: "wrapped-bitcoin",
  },
  {
    src: "/assets/icons/usdc.png",
    alt: "USD Coin logo",
    symbol: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    coinGeckoId: "usd-coin",
  },
  {
    src: "/assets/icons/ampl.png",
    alt: "Ampleforth logo",
    symbol: "AMPL",
    address: "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
    coinGeckoId: "ampleforth",
  },
  {
    src: "/assets/icons/busd.png",
    alt: "Binance USD logo",
    symbol: "BUSD",
    address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    coinGeckoId: "binance-usd",
  },
  {
    src: "/assets/icons/dai.png",
    alt: "Dai logo",
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    coinGeckoId: "dai",
  },
  {
    src: "/assets/icons/frax.png",
    alt: "Frax logo",
    symbol: "FRAX",
    address: "0x853d955acef822db058eb8505911ed77f175b99e",
    coinGeckoId: "frax",
  },
  {
    src: "/assets/icons/gusd.png",
    alt: "Gemini Dollar logo",
    symbol: "GUSD",
    address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
    coinGeckoId: "gemini-dollar",
  },
  {
    src: "/assets/icons/usdp.png",
    alt: "Pax Dollar logo",
    symbol: "USDP",
    address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
    coinGeckoId: "pax-dollar",
  },
  {
    src: "/assets/icons/rai.png",
    alt: "Rai Reflex Index logo",
    symbol: "RAI",
    address: "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
    coinGeckoId: "rai",
  },
  {
    src: "/assets/icons/susd.png",
    alt: "sUSD logo",
    symbol: "sUSD",
    address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
    coinGeckoId: "susd",
  },
  {
    src: "/assets/icons/tusd.png",
    alt: "TrueUSD logo",
    symbol: "TUSD",
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    coinGeckoId: "true-usd",
  },
  {
    src: "/assets/icons/usdt.png",
    alt: "Tether logo",
    symbol: "USDT",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    coinGeckoId: "tether",
  },
  {
    src: "/assets/icons/uniswap.png",
    alt: "Uniswap logo",
    symbol: "UNI",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    coinGeckoId: "uniswap",
  },
  {
    src: "/assets/icons/matic.png",
    alt: "Matic logo",
    symbol: "Matic",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    coinGeckoId: "matic-network",
  },
]

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
