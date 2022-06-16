import { Token } from "data/tokenConfig"

export const getCurrentAsset = (
  tokens: Token[],
  activeAsset?: string
): Token | undefined => {
  const currentAsset = tokens.findIndex(
    (token) =>
      token.address.toUpperCase() === activeAsset?.toUpperCase()
  )

  if (currentAsset === -1) return undefined

  return tokens[currentAsset]
}
