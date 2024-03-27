import React from "react"
import {
  Heading,
  HStack,
  Text,
  VStack,
  Link,
  Box,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import { TransparentCard } from "../TransparentCard"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import SnapshotForm from "components/_forms/SnapshotForm"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { useBrandedToast } from "hooks/chakra"
import { chainSlugMap } from "data/chainConfig"
import CampaignTable from "./CampaignTable" // Ensure this import path is correct

export interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

export const SnapshotCard: React.FC = () => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { chain: wagmiChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, close } = useBrandedToast()
  const methods = useForm<SnapshotFormValues>({
    defaultValues: {
      eth_address: "",
      somm_address: "",
    },
  })

  const ethChainId = 1 // Ethereum Mainnet ID
  const isWrongNetwork = !!wagmiChain && wagmiChain.id !== ethChainId
  const ethChain = chainSlugMap.ETHEREUM

  return (
    <HStack spacing={10} align="flex-start">
      <VStack spacing={4} width="full">
        {isMounted && isConnected && isWrongNetwork && (
          <HStack
            p={4}
            mb={12}
            spacing={4}
            align="flex-start"
            backgroundColor="purple.dark"
            border="2px solid"
            borderRadius={16}
            borderColor="purple.base"
            width="full"
          >
            <InformationIcon color="yellow" boxSize={6} />
            <VStack align="flex-start" spacing={4} width="100%">
              <Heading size="md">
                <Text>Wrong Network</Text>
              </Heading>
              <Text fontFamily="Haffer" align="center">
                Your connected wallet is on the {wagmiChain?.name}{" "}
                network. Please switch to Ethereum Mainnet to use this
                feature.
              </Text>
              <SecondaryButton
                variant="solid"
                color="white"
                bg="gradient.primary"
                borderWidth={2}
                borderColor="purple.base"
                onClick={async () => {
                  try {
                    await switchNetworkAsync?.(ethChain.wagmiId)
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
            </VStack>
          </HStack>
        )}
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
            Snapshot
          </Heading>
          <Text fontSize="md" mb="4">
            Link your wallets for Bonus SOMM rewards or/and
            airdrops.
          </Text>
          <FormProvider {...methods}>
            <SnapshotForm wrongNetwork={isWrongNetwork} />
          </FormProvider>
        </TransparentCard>
      </VStack>
      <Box flexShrink={0}>
        <CampaignTable />
      </Box>
    </HStack>
  )
}

export default SnapshotCard
