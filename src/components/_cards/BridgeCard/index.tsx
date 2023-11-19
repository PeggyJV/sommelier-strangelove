import {
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import React from "react"
import { TransparentCard } from "../TransparentCard"
import { Link } from "components/Link"
import { BridgeForm } from "components/_forms/BridgeForm"
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { chainSlugMap } from "data/chainConfig"
import { useBrandedToast } from "hooks/chakra"

export interface BridgeFormValues {
  amount: number
  address: string
  type: "TO_SOMMELIER" | "TO_ETHEREUM"
}

export const BridgeCard: React.FC = () => {
  const isMounted = useIsMounted()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const { isConnected } = useAccount()
  const methods = useForm<BridgeFormValues>({
    defaultValues: {
      type: "TO_SOMMELIER",
    },
  })
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, close } = useBrandedToast()

  const { chain: wagmiChain } = useNetwork()
  const ethChain = chainSlugMap.ETHEREUM

  const WrongNetwork = (
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
              <Text>Wrong Network</Text>
            </HStack>
          </Heading>
          <Text fontFamily="Haffer" align="center">
            Your connected wallet is on {wagmiChain?.name}. For
            the time being, the bridge is only availible between
            Ethereum and Sommelier. Please switch to{" "}
            {ethChain.displayName} to use the bridge.
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
                  await switchNetworkAsync?.(ethChain.wagmiId)
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
              Switch to {ethChain.displayName}
            </SecondaryButton>
          </HStack>
        </VStack>
      </HStack>
    </HStack>
  )

  return (
    <VStack spacing={4}>
      {isMounted &&
      isConnected &&
      wagmiChain &&
      wagmiChain.id !== ethChain.wagmiId
        ? WrongNetwork
        : null}
      <TransparentCard
        maxW="432px"
        w="full"
        boxShadow="purpleOutline1"
        px={{ base: 5, md: 12 }}
        pt="52px"
        pb="48px"
        borderRadius={{ base: "32px", md: "40px" }}
        mx={4}
      >
        <Heading as="h4" fontSize={24} mb="44px">
          Bridge
        </Heading>
        <Text fontSize="md" mb="41px">
          Bridge your Ethereum SOMM back home to its native Cosmos
          representation on Sommelier or from Sommelier to Ethereum.{" "}
          <Link
            ml={1}
            fontSize="xs"
            fontWeight="semibold"
            textDecoration="underline"
            href="https://www.notion.so/Bridge-UI-88307640a6ab4f649b6a0b3cb6cb4d34"
            target="_blank"
          >
            Read More{" "}
            <ExternalLinkIcon boxSize={3} color="purple.base" />
          </Link>
        </Text>
        {isMounted && (
          <FormProvider {...methods}>
            <BridgeForm wrongNetwork={wagmiChain && wagmiChain.id !== ethChain.wagmiId}/>
          </FormProvider>
        )}
      </TransparentCard>
    </VStack>
  )
}
