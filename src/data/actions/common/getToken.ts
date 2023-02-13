import { fetchToken } from "@wagmi/core"
import { tokenConfig } from "data/tokenConfig"

export const getTokenByAddress = async (address: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.address.toLowerCase() === address.toLowerCase()
  )
  const token = await fetchToken({
    address: address,
  })
  return { ...tokenInfo, ...token }
}
export const getTokenBySymbol = async (symbol: string) => {
  const tokenInfo = tokenConfig.find(
    (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
  )
  const token = await fetchToken({
    address: tokenInfo!.address,
  })
  return { ...tokenInfo, ...token }
}
