import React from "react"
import { VStack, Heading, Text, Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from "components/_icons"
import { TransparentCard } from "../TransparentCard"
import { useAccount, useNetwork } from "wagmi"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import SnapshotForm from "components/_forms/SnapshotForm"
export interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

export const SnapshotCard: React.FC = () => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const methods = useForm<SnapshotFormValues>({
    defaultValues: {
      eth_address: "",
      somm_address: "",
    },
  })
  const { chain } = useNetwork()
  const ethChainId = 1

  return (
    <VStack spacing={4}>
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
        <Text fontSize="md" mb="41px">
          Connect your Sommelier vaults wallet and your SOMM staking
          wallet (Keplr) to participate in airdrops and/or earn other
          rewards.
        </Text>
        {isMounted && (
          <FormProvider {...methods}>
            <SnapshotForm
              wrongNetwork={!!chain && chain.id !== ethChainId}
            />
          </FormProvider>
        )}
      </TransparentCard>
    </VStack>
  )
}

export default SnapshotCard
