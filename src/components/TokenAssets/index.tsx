import { StackProps } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { FC } from "react"
import { CroppedMap } from "./TokenMaps/CroppedMap"
import { UncroppedMap } from "./TokenMaps/UncroppedMap"

export interface TokenAssetsProps extends StackProps {
  tokens: Token[]
  activeAsset: string
  displaySymbol?: boolean
}

export const TokenAssets: FC<TokenAssetsProps> = ({
  tokens,
  activeAsset: _activeAsset,
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
