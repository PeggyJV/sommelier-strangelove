import { Heading, Stack, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { TransparentCard } from "../TransparentCard"
import { Link } from "components/Link"
import { BridgeForm } from "components/_forms/BridgeForm"
import { useAccount } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"
import { FormProvider, useForm } from "react-hook-form"
import { useIsMounted } from "hooks/utils/useIsMounted"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

export interface BridgeFormValues {
  amount: number
  sommelierAddress: string
}

export const BridgeCard: React.FC = () => {
  const isMounted = useIsMounted()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const { isConnected } = useAccount()
  const methods = useForm<BridgeFormValues>()

  return (
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
      {isMounted &&
        (isConnected ? (
          <FormProvider {...methods}>
            <BridgeForm />
          </FormProvider>
        ) : (
          <Stack>
            <ConnectButton unstyled />
          </Stack>
        ))}
    </TransparentCard>
  )
}
