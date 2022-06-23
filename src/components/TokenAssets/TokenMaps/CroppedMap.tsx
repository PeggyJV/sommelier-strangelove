import {
  Avatar,
  Box,
  HStack,
  StackProps,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { ControlsIcon } from "components/_icons"
import { Token } from "data/tokenConfig"
import { useState, VFC } from "react"

interface CroppedMapProps extends StackProps {
  tokens: Token[]
  displaySymbol?: boolean
}

export const CroppedMap: VFC<CroppedMapProps> = ({
  tokens,
  displaySymbol,
  ...rest
}) => {
  const [displayedAsset, setDisplayedAsset] = useState<string | null>(
    null
  )
  const tokensCropped = tokens.slice(0, 6)

  return (
    <HStack align="flex-start">
      <HStack role="group" pt={1} spacing={-1.5} {...rest}>
        {tokensCropped?.map((token, i) => {
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
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label={
            <VStack align="flex-start" minW={120}>
              {tokens.map((token, i) => {
                const { src, alt, address, symbol } = token

                return (
                  <HStack key={address + i}>
                    <Avatar
                      boxSize="24px"
                      src={src}
                      name={alt}
                      borderWidth={2}
                      borderColor="surface.bg"
                      bg="surface.bg"
                    />
                    <Text>{symbol}</Text>
                  </HStack>
                )
              })}
            </VStack>
          }
          py={3}
          px={5}
          bg="surface.bg"
          borderWidth={1}
          borderRadius={8}
          borderColor="purple.base"
        >
          <Box
            as="span"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="24px"
            borderRadius="full"
            borderWidth={2}
            borderColor="surface.bg"
            overflow="hidden"
            zIndex="popover"
            opacity={0.65}
            _hover={{
              opacity: 1,
            }}
          >
            <ControlsIcon p={1.5} boxSize="inherit" bg="#6C4ED9" />
          </Box>
        </Tooltip>
      </HStack>
      {displaySymbol && (
        <Text as="span" minW="5ch">
          {displayedAsset}
        </Text>
      )}
    </HStack>
  )
}
