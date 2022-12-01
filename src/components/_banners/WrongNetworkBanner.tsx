import { Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { BlockIcon } from "components/_icons"
import { useBrandedToast } from "hooks/chakra"
import React, { VFC } from "react"
import { useSwitchNetwork } from "wagmi"

export const WrongNetworkBanner: VFC = () => {
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, close } = useBrandedToast()
  return (
    <HStack
      p={4}
      mb={12}
      spacing={4}
      align="flex-start"
      backgroundColor="red.extraDark"
      border="2px solid"
      borderRadius={16}
      borderColor="red.dark"
    >
      <BlockIcon color="red.base" />
      <VStack align="flex-start">
        <Heading size="sm">Wrong Network</Heading>
        <Text>
          You are on the wrong network, this may cause executing
          contracts to fail. Please switch your network to the
          Ethereum chain.
        </Text>
        <SecondaryButton
          onClick={async () => {
            try {
              await switchNetworkAsync?.(1)
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
          Switch to Ethereum
        </SecondaryButton>
      </VStack>
    </HStack>
  )
}
