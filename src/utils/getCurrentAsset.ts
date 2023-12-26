import { Token } from "data/tokenConfig"

export const getCurrentAsset = (
  tokens: Token[],
  chain: string,
  activeAsset?: string,
): Token | undefined => {
  const currentAsset = tokens.findIndex(
    (token) =>
      token.address.toUpperCase() === activeAsset?.toUpperCase() && token.chain === chain
  )

  if (currentAsset === -1) return undefined

  return tokens[currentAsset]
}
