import React from "react"
import {
  Heading,
  VStack,
  Text,
  Box,
  Stack,
  useBreakpointValue,
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
import CampaignTable from "./CampaignTable"

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

  const stackAlignment = useBreakpointValue({
    base: "center",
    md: "flex-start",
  })

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={10}
      align={stackAlignment} // Dynamic alignment based on screen size
      width="full"
    >
      {isMounted && isConnected && isWrongNetwork && (
        <Box
          p={4}
          mb={12}
          backgroundColor="purple.dark"
          border="2px solid"
          borderRadius={16}
          borderColor="purple.base"
          width="full"
        >
          <VStack spacing={4}>
            <InformationIcon color="yellow" boxSize={6} />
            <Heading size="md">
              <Text>Wrong Network</Text>
            </Heading>
            <Text>
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
                  const ethChainConfig = chainSlugMap["ETHEREUM"]
                  if (switchNetworkAsync && ethChainConfig) {
                    await switchNetworkAsync(ethChainConfig.wagmiId)
                    window.location.reload()
                  }
                } catch (e) {
                  const error = e as Error
                  addToast({
                    heading: "Change network error",
                    status: "error",
                    body: <Text>{error.message}</Text>,
                    closeHandler: close,
                    duration: null,
                  })
                }
              }}
            >
              Switch to Ethereum Mainnet
            </SecondaryButton>
          </VStack>
        </Box>
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
        <Heading as="h4" size="lg" mb={4}>
          Snapshot
        </Heading>
        <Text mb={4}>
          Link your wallets for Bonus SOMM rewards or/and airdrops.
        </Text>
        <FormProvider {...methods}>
          <SnapshotForm wrongNetwork={isWrongNetwork} />
        </FormProvider>
      </TransparentCard>
      <CampaignTable />
    </Stack>
  )
}

export default SnapshotCard
