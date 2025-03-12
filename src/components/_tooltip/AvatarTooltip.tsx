import { Box, HStack, Image, Text } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { FC } from "react"
import { getProtocols } from "utils/getProtocols"
import { Chain } from "data/chainConfig"

type AvatarTooltipProps = {
  protocols?: string[]
  tradedAssets?: Token[]
  chains?: Chain[]
}

export const AvatarTooltip: FC<AvatarTooltipProps> = ({
  protocols,
  tradedAssets,
  chains,
}) => {
  return (
    <Box
      position="absolute"
      bg="neutral.900"
      py="4"
      px="6"
      boxShadow="xl"
      zIndex={10}
      display="flex"
      flexDir="column"
      gap={3}
      rounded="lg"
      mt={4}
      opacity={1}
      css={{
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {chains &&
        chains.map((chain: Chain) => {
          return (
            <HStack key={chain.id}>
              <Box
                width="32px"
                height="32px"
                borderRadius="full"
                overflow="hidden"
                background="transparent"
              >
                <Image
                  src={chain.logoPath}
                  alt={chain.displayName}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Text fontSize="12px" fontWeight={600}>
                {chain.displayName}
              </Text>
            </HStack>
          )
        })}
      {protocols &&
        protocols.map((protocol: string) => {
          const data = getProtocols(protocol)
          return (
            <HStack key={protocol}>
              <Box
                width="32px"
                height="32px"
                borderRadius="full"
                overflow="hidden"
                background="transparent"
              >
                <Image
                  src={data.icon}
                  alt={data.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Text fontSize="12px" fontWeight={600}>
                {data.title}
              </Text>
            </HStack>
          )
        })}
      {tradedAssets &&
        tradedAssets.map(({ symbol, src }: Token) => {
          return (
            <HStack key={symbol}>
              <Box
                width="32px"
                height="32px"
                borderRadius="full"
                overflow="hidden"
                bgColor="white"
              >
                <Image
                  src={src}
                  alt={symbol}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Text fontSize="12px" fontWeight={600}>
                {symbol}
              </Text>
            </HStack>
          )
        })}
    </Box>
  )
}
