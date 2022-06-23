import { Avatar, HStack, StackProps, Text } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { useState, VFC } from "react"

interface UncroppedMapProps extends StackProps {
  tokens: Token[]
  displaySymbol?: boolean
}

export const UncroppedMap: VFC<UncroppedMapProps> = ({
  tokens,
  displaySymbol,
  ...rest
}) => {
  const [displayedAsset, setDisplayedAsset] = useState<string | null>(
    null
  )

  return (
    <HStack>
      <HStack role="group" pt={1} spacing={-1.5} {...rest}>
        {tokens.map((token, i) => {
          const { src, alt, address, symbol } = token
          return (
            <Avatar
              key={address + i}
              boxSize="24px"
              src={src}
              name={alt}
              borderWidth={2}
              borderColor="surface.bg"
              bg="surface.bg"
              _notFirst={{
                opacity: 0.65,
              }}
              _hover={{
                opacity: 1,
              }}
              _groupHover={{
                _first: {
                  opacity: 0.65,
                },
              }}
              _first={{
                _hover: {
                  opacity: "1 !important",
                },
              }}
              onMouseEnter={() => setDisplayedAsset(symbol)}
              onMouseLeave={() => setDisplayedAsset(null)}
            />
          )
        })}
      </HStack>
      {displaySymbol && (
        <Text as="span" minW="5ch">
          {displayedAsset}
        </Text>
      )}
    </HStack>
  )
}
