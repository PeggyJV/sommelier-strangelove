import { Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { BlockIcon } from "components/_icons"
import React, { VFC } from "react"

export const GeoBanner: VFC = () => {
  return (
    <HStack
      p={4}
      mb={12}
      spacing={4}
      align="flex-start"
      backgroundColor="red.extraDark"
      border="2px solid"
      borderRadius={16}
      borderColor="red.dark"
    >
      <BlockIcon color="red.base" />
      <VStack align="flex-start">
        <Heading size="sm">Service Unavailable</Heading>
        <Text>
          Cellars are not available to people or companies who are
          residents of, or are located, incorporated or have
          registered agent in, the United States or a restricted
          territory.
        </Text>
        {/* <Text>
          More details can be found in our{" "}
          <Link href="/terms">
            Terms of Service <ExternalLinkIcon color="purple.base" />
          </Link>
        </Text> */}
      </VStack>
    </HStack>
  )
}
