import { tokenConfig } from "data/tokenConfig"

export const getTokenByAddress = (address: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.address.toLowerCase() === address.toLowerCase()
  )
  return { ...tokenInfo }
}
export const getTokenBySymbol = (symbol: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
  )
  return { ...tokenInfo }
}
