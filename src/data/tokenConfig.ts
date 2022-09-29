export interface Token {
  src: string
  alt: string
  symbol: string
  address: string
}

/**
 *
 *  tokenConfig is for storing the all token data that used in the app
 */
export const tokenConfig: Token[] = [
  {
    src: "/assets/icons/ampl.png",
    alt: "Ampleforth logo",
    symbol: "AMPL",
    address: "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
  },
  {
    src: "/assets/icons/busd.png",
    alt: "Binance USD logo",
    symbol: "BUSD",
    address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
  },
  {
    src: "/assets/icons/dai.png",
    alt: "Dai logo",
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  {
    src: "/assets/icons/fei.png",
    alt: "Fei logo",
    symbol: "FEI",
    address: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
  },
  {
    src: "/assets/icons/frax.png",
    alt: "Frax logo",
    symbol: "FRAX",
    address: "0x853d955acef822db058eb8505911ed77f175b99e",
  },
  {
    src: "/assets/icons/gusd.png",
    alt: "Gemini Dollar logo",
    symbol: "GUSD",
    address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
  },
  {
    src: "/assets/icons/usdp.png",
    alt: "Pax Dollar logo",
    symbol: "USDP",
    address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
  },
  {
    src: "/assets/icons/rai.png",
    alt: "Rai Reflex Index logo",
    symbol: "RAI",
    address: "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
  },
  {
    src: "/assets/icons/susd.png",
    alt: "sUSD logo",
    symbol: "sUSD",
    address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
  },
  {
    src: "/assets/icons/tusd.png",
    alt: "TrueUSD logo",
    symbol: "TUSD",
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
  },
  {
    src: "/assets/icons/usdc.png",
    alt: "USD Coin logo",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    src: "/assets/icons/usdt.png",
    alt: "Tether logo",
    symbol: "USDT",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
]

const depositAssetTokenList = [
  "AMPL",
  "BUSD",
  "DAI",
  "FEI",
  "FRAX",
  "GUSD",
  "USDP",
  "RAI",
  "sUSD",
  "TUSD",
  "USDC",
  "USDT",
]

export const depositAssetTokenConfig: Token[] = tokenConfig.filter(
  (token) => depositAssetTokenList.includes(token.symbol)
)
