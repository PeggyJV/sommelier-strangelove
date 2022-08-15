import { Heading, Stack, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { TransparentCard } from "../TransparentCard"
import { Link } from "components/Link"
import { BridgeForm } from "components/_forms/BridgeForm"
import { useConnect } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"

export const BridgeCard: React.FC = () => {
  const [auth] = useConnect()
  const isConnected = auth.data.connected
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
        $SOMM emits on Ethereum. We bridge SOMM back to Cosmos for
        you.{" "}
        <Link
          ml={1}
          fontSize="xs"
          fontWeight="semibold"
          textDecoration="underline"
        >
          Read More{" "}
          <ExternalLinkIcon boxSize={3} color="purple.base" />
        </Link>
      </Text>
      {isConnected ? (
        <BridgeForm />
      ) : (
        <Stack>
          {auth.data.connectors.map((c) => (
            <ConnectButton connector={c} key={c.id} unstyled />
          ))}
        </Stack>
      )}
    </TransparentCard>
  )
}
