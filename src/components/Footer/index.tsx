import {
  Container,
  ContainerProps,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react"
import { VFC } from "react"
import { Socials } from "components/Socials"
import { FooterLink } from "./FooterLink"

const Footer: VFC<ContainerProps> = (props) => {
  return (
    <Container
      as="footer"
      display="flex"
      maxW="container.lg"
      mt={20}
      {...props}
    >
      <Flex
        ml={2}
        mr={2}
        borderTop="1px solid"
        borderColor="neutral.700"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        py={10}
        flexDirection={{ base: "column", sm: "row" }}
      >
        <Text fontSize="xs" mb={{ base: 6, sm: 0 }}>
          &copy; {new Date().getFullYear()} Sommelier
        </Text>
        <HStack
          spacing={4}
          justify="center"
          align="center"
          flexDirection={{ base: "column-reverse", sm: "row" }}
        >
          <HStack
            spacing={4}
            justify="center"
            align="center"
            mt={{ base: 6, sm: 0 }}
            mb={{ base: 6, sm: 0 }}
          >
            <FooterLink href="/">Documentation</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
          </HStack>
          <Socials />
        </HStack>
      </Flex>
    </Container>
  )
}

export default Footer
