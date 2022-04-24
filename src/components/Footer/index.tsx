import {
  Container,
  ContainerProps,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react"
import React, { VFC } from "react"
import { Socials } from "components/Socials"
import { FooterLink } from "./FooterLink"

const Footer: VFC<ContainerProps> = (props) => {
  return (
    <Container
      as="footer"
      display="flex"
      maxW="container.lg"
      {...props}
    >
      <Flex
        ml={4}
        mr={4}
        borderTop="1px solid"
        borderColor="rgba(203, 198, 209, 0.25)"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        py={10}
      >
        <Text fontSize="xs">
          &copy; {new Date().getFullYear()} Sommelier
        </Text>
        <HStack spacing={4} justify="center" align="center">
          <FooterLink href="/">Documentation</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <Socials />
        </HStack>
      </Flex>
    </Container>
  )
}

export default Footer
