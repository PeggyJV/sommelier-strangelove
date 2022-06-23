import { StackProps } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { useMemo, VFC } from "react"
import { CroppedMap } from "./TokenMaps/CroppedMap"
import { UncroppedMap } from "./TokenMaps/UncroppedMap"

export interface TokenAssetsProps extends StackProps {
  tokens: Token[]
  activeAsset: string
  displaySymbol?: boolean
}

export const TokenAssets: VFC<TokenAssetsProps> = ({
  tokens,
  activeAsset,
  displaySymbol,
  ...rest
}) => {
  // set active strategy asset as first in tokens array
  const rearrangedTokens = useMemo(() => {
    const activeIndex = tokens.findIndex(
      (token) =>
        token.address.toUpperCase() === activeAsset.toUpperCase()
    )

    if (activeIndex < 1) {
      return tokens
    }

    return [
      tokens[activeIndex],
      ...tokens.slice(0, activeIndex),
      ...tokens.slice(activeIndex + 1),
    ]
  }, [tokens, activeAsset])

  return rearrangedTokens.length > 6 ? (
    <CroppedMap
      tokens={rearrangedTokens}
      displaySymbol={displaySymbol}
      {...rest}
    />
  ) : (
    <UncroppedMap
      tokens={rearrangedTokens}
      displaySymbol={displaySymbol}
      {...rest}
    />
  )
}
