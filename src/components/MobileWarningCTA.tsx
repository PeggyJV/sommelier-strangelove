import { Container, StackProps, Text, VStack } from "@chakra-ui/react"
import React, { FC } from "react"
import { Link } from "./Link"
import { LogoTextIcon } from "./_icons"

export const MobileWarningCTA: FC<StackProps> = (props) => {
  return (
    <Container as="body" display="flex" minH="100vh" p={6}>
      <VStack
        spacing={6}
        align="center"
        justify="center"
        fontSize={12}
        {...props}
      >
        <LogoTextIcon h={6} w="auto" />
        <Text textAlign="center">
          This app is only supported on desktop at this time. Got
          feedback? We'd love to hear it.
        </Text>
        <Link
          href="https://t.me/getsomm"
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
