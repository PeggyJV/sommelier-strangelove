import { Token } from "data/tokenConfig"

export const getCurrentAsset = (
  tokens: Token[],
  chain: string,
  activeAsset?: string,
): Token | undefined => {
  return tokens.find(
    (token) =>
      token.address.toUpperCase() === activeAsset?.toUpperCase() && token.chain === chain
  )
}
