import React from "react"
import {
  VStack,
  Heading,
  Text,
  HStack,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { TransparentCard } from "../TransparentCard"
import { SnapshotForm } from "components/_forms/SnapshotForm" // Ensure this import path is correct
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { chainSlugMap } from "data/chainConfig"
import { useBrandedToast } from "hooks/chakra"

export interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

export const SnapshotCard: React.FC = () => {
  const isMounted = useIsMounted()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const { isConnected } = useAccount()
  const methods = useForm<SnapshotFormValues>({
    defaultValues: {
      eth_address: "0xfoobar",
      somm_address: "somme1foobar",
    },
  })
  const { switchNetworkAsync } = useSwitchNetwork()
  const { addToast, close } = useBrandedToast()

  const { chain: wagmiChain } = useNetwork()
  const ethChain = chainSlugMap.ETHEREUM

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
          Snapshot text placeholder.{" "}
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
            <SnapshotForm
              wrongNetwork={
                !!wagmiChain && wagmiChain.id !== ethChain.wagmiId
              }
            />
          </FormProvider>
        )}
      </TransparentCard>
    </VStack>
  )
}

export default SnapshotCard
