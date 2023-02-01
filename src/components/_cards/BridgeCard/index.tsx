import {
  Center,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import React from "react"
import { TransparentCard } from "../TransparentCard"
import { Link } from "components/Link"
import { BridgeForm } from "components/_forms/BridgeForm"
import { useAccount, useConnect } from "wagmi"
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
  const { connectors } = useConnect()
  const { isConnected } = useAccount()
  const methods = useForm<BridgeFormValues>()

  return (
    <TransparentCard
      maxW="432px"
      w="full"
      boxShadow="purpleOutline1"
      px={12}
      pt="52px"
      pb="48px"
      borderRadius="40px"
    >
      <Heading as="h4" fontSize={24} mb="44px">
        Bridge
      </Heading>
      <Text fontSize="md" mb="41px">
        Bridge your Ethereum SOMM back home to its native Cosmos
        representation on Sommelier.{" "}
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
      {isLarger768 ? (
        isMounted &&
        (isConnected ? (
          <FormProvider {...methods}>
            <BridgeForm />
          </FormProvider>
        ) : (
          <Stack>
            {connectors.map((c) => (
              <ConnectButton connector={c} key={c.id} unstyled />
            ))}
          </Stack>
        ))
      ) : (
        <Center>
          <HStack spacing="6px">
            <InformationIcon color="red.base" boxSize="12px" />
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="red.light"
            >
              Bridge not yet supported on mobile
            </Text>
          </HStack>
        </Center>
      )}
    </TransparentCard>
  )
}
