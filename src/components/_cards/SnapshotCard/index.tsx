import React from "react"
import { Heading, HStack, Text, VStack, Link } from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import { TransparentCard } from "../TransparentCard"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import SnapshotForm from "components/_forms/SnapshotForm"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { useBrandedToast } from "hooks/chakra"
import { chainSlugMap } from "data/chainConfig"

export interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

export const SnapshotCard: React.FC = () => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { chain: wagmiChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, update, close, closeAll } = useBrandedToast()
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
    <VStack spacing={4}>
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
          <HStack
            justifyContent="center"
            align="flex-start"
            width="100%"
          >
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
                Your connected wallet is on the {wagmiChain?.name}{" "}
                network. Please switch to Ethereum Mainnet to use this
                feature.
              </Text>
              <HStack
                align="center"
                width="100%"
                justifyContent="center"
              >
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
          To qualify for airdrops and rewards, please:
        </Text>
        <Text fontSize="md" mb="4">
          1.{" "}
          <Text as="span" fontWeight="bold">
            Link Wallets:
          </Text>{" "}
          Connect your Ethereum address SOMM address.
        </Text>
        <Text fontSize="md" mb="4">
          2.{" "}
          <Text as="span" fontWeight="bold">
            Stake SOMM Tokens:
          </Text>{" "}
          Ensure your SOMM wallet actively{" "}
          <Link
            href="https://www.sommelier.finance/staking"
            isExternal
            color="blue.500"
          >
            stakes SOMM tokens
          </Link>
          .
        </Text>
        <Text fontSize="md" mb="4">
          3.{" "}
          <Text as="span" fontWeight="bold">
            Invest in Strategies:
          </Text>{" "}
          Make sure your Ethereum address has investments in{" "}
          <Link
            href="https://app.sommelier.finance/"
            isExternal
            color="blue.500"
          >
            Sommelier strategies
          </Link>
          .
        </Text>

        <FormProvider {...methods}>
          <SnapshotForm wrongNetwork={isWrongNetwork} />
        </FormProvider>
      </TransparentCard>
    </VStack>
  )
}

export default SnapshotCard
