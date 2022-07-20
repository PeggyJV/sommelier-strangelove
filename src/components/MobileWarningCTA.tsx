import { Container, StackProps, Text, VStack } from "@chakra-ui/react"
import React, { FC } from "react"
import { Link } from "./Link"
import { LogoTextIcon } from "./_icons"

export const MobileWarningCTA: FC<StackProps> = (props) => {
  return (
    <Container display="flex" minH="100vh" flexDir="column" p={8}>
      <VStack
        flex={1}
        spacing={6}
        justify="center"
        fontSize={12}
        {...props}
      >
        <LogoTextIcon h={6} w="auto" />
        <Text textAlign="center">
          This app is not supported on mobile at this time - try it on
          desktop instead.
        </Text>
        <Link
          href="https://www.sommelier.finance/"
          fontWeight="bold"
          textDecoration="underline"
        >
          Join the conversation
        </Link>
        <Link
          href="https://www.sommelier.finance/"
          fontWeight="bold"
          textDecoration="underline"
        >
          Learn more
        </Link>
      </VStack>
    </Container>
  )
}
