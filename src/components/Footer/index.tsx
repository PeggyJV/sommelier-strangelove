import {
  Container,
  ContainerProps,
  HStack,
  Text,
} from "@chakra-ui/react"
import React, { VFC } from "react"
import Socials from "components/Socials"
import { FooterLink } from "./FooterLink"

const Footer: VFC<ContainerProps> = (props) => {
  return (
    <Container
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={10}
      borderTop="1px solid"
      borderColor="rgba(203, 198, 209, 0.25)"
      maxW="container.lg"
      {...props}
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
    </Container>
  )
}

export default Footer
