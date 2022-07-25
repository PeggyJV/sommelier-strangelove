import { StackProps } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { VFC } from "react"
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
  return tokens.length > 6 ? (
    <CroppedMap
      tokens={tokens}
      displaySymbol={displaySymbol}
      {...rest}
    />
  ) : (
    <UncroppedMap
      tokens={tokens}
      displaySymbol={displaySymbol}
      {...rest}
    />
  )
}
