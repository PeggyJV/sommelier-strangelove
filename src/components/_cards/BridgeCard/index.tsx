import { Heading, Stack, Center, Text } from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { ExternalLinkIcon, TimerIcon } from "components/_icons"
import React from "react"
import { TransparentCard } from "../TransparentCard"
import { Link } from "components/Link"
import { InputAmount } from "./InputAmount"
import { EthereumAddress } from "./EthereumAddress"
import { InputCosmosAddress } from "./InputCosmosAddress"

export const BridgeCard: React.FC = () => (
  <TransparentCard
    maxW="432px"
    w="full"
    boxShadow="0 0 0 2px #6C4ED9"
    px={12}
    pt="52px"
    pb="48px"
    borderRadius="40px"
  >
    <Heading as="h4" fontSize={24} mb="44px">
      Bridge
    </Heading>
    <Text fontSize="md" mb="41px">
      $SOMM emits on Ethereum. We bridge SOMM back to Cosmos for you.{" "}
      <Link
        ml={1}
        fontSize="xs"
        fontWeight="semibold"
        textDecoration="underline"
      >
        Read More <ExternalLinkIcon boxSize={3} color="purple.base" />
      </Link>
    </Text>
    <Stack spacing="40px">
      <Stack spacing={6}>
        <InputAmount />
        <EthereumAddress />
        <InputCosmosAddress />
      </Stack>
      <BaseButton height="69px" fontSize="21px" disabled>
        Bridge $SOMM
      </BaseButton>
      <Center>
        <TimerIcon color="orange.base" boxSize="12px" mr={"6px"} />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="orange.light"
        >
          Transaction should process within 10-15 minutes.
        </Text>
      </Center>
    </Stack>
  </TransparentCard>
)
