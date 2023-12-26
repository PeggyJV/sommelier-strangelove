import { tokenConfig } from "data/tokenConfig"

export const getTokenByAddress = (address: string, chain: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.address.toLowerCase() === address.toLowerCase() && item.chain === chain
  )
  return { ...tokenInfo }
}
export const getTokenBySymbol = (symbol: string, chain: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.symbol.toLowerCase() === symbol.toLowerCase() && item.chain === chain
  )
  return { ...tokenInfo }
}
