import { HStack, Text, VStack } from "@chakra-ui/react"
import { BlockIcon } from "components/_icons"
import React, { FC } from "react"

export const MaintenanceBanner: FC = () => {
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
        <Text>
          We are aware of the issue which is causing some numbers on
          the app to not to be populated, please be patient as we
          resolve this as quickly as we can.
        </Text>
      </VStack>
    </HStack>
  )
}
