import {
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { InformationIcon } from "components/_icons"
import { useBrandedToast } from "hooks/chakra"
import React, { VFC } from "react"
import { useSwitchNetwork, useNetwork } from "wagmi"
import { Chain } from "src/data/chainConfig"

interface WrongNetworkBannerProps {
  chain?: Chain
}

export const WrongNetworkBanner: VFC<WrongNetworkBannerProps> = ({
  chain,
}) => {
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, close } = useBrandedToast()
  const { chain: wagmiChain } = useNetwork()

  // Some pages dont require chain so it can be undefined, continue as normal if so
  if (!chain || !wagmiChain || wagmiChain.id === chain.wagmiId)
    return null

  return (
    <HStack
      p={4}
      mb={12}
      spacing={4}
      align="flex-start"
      backgroundColor="purple.dark"
      border="2px solid"
      borderRadius={16}
      borderColor="purple.base"
    >
      <InformationIcon color="yellow" boxSize={6} />
      <HStack justifyContent="center" align="flex-start" width="100%">
        <VStack align="flex-start" spacing={4}>
          <Heading size="md" width="100%">
            <HStack
              align="center"
              width="100%"
              justifyContent="center"
            >
              <Image
                src={chain.logoPath}
                alt={chain.displayName}
                boxSize="24px"
              />
              <Text>{chain.displayName} Vault</Text>
            </HStack>
          </Heading>
          <Text fontFamily="Haffer">
            Your connected wallet is on the {wagmiChain.name} network.
            This vault is on {chain.displayName}, to use
            it please switch networks.
          </Text>
          <HStack align="center" width="100%" justifyContent="center">
            <SecondaryButton
              variant="solid"
              color="white"
              bg="gradient.primary"
              borderWidth={2}
              borderColor="purple.base"
              onClick={async () => {
                try {
                  await switchNetworkAsync?.(chain.wagmiId)
                  // Reload the page to ensure everything is in sync
                  window.location.reload()
                } catch (e) {
                  const error = e as Error
                  addToast({
                    heading: "Change network error",
                    status: "error",
                    body: <Text>{error?.message}</Text>,
                    closeHandler: close,
                    duration: null,
                  })
                }
              }}
            >
              Switch to {chain.displayName}
            </SecondaryButton>
          </HStack>
        </VStack>
      </HStack>
    </HStack>
  )
}
