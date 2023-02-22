import {
  Container,
  ContainerProps,
  Flex,
  HStack,
  Text,
  Wrap,
} from "@chakra-ui/react"
import { VFC } from "react"
import { Socials } from "components/Socials"
import { FooterLink } from "./FooterLink"
import { ExternalLinkIcon } from "components/_icons"
import { Disclaimer } from "./Disclaimer"
import { About } from "./About"

const Footer: VFC<ContainerProps> = (props) => {
  return (
    <Container maxW="container.lg">
      <About />
      <Disclaimer />
      <Container
        as="footer"
        display="flex"
        maxW="container.lg"
        px={0}
        mt={20}
        {...props}
      >
        <Flex
          borderTop="1px solid"
          borderColor="neutral.700"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          py={10}
          flexDirection={{ base: "column", sm: "row" }}
          fontSize="xs"
        >
          <Text mb={{ base: 6, sm: 0 }} color="neutral.300">
            &copy; {new Date().getFullYear()} Sommelier
          </Text>
          <Wrap
            spacing={{ base: 4, lg: 8 }}
            justify={{ base: "center", sm: "right" }}
            align="center"
            flexDirection={{ base: "column-reverse", sm: "row" }}
            fontWeight="semibold"
            color="neutral.100"
          >
            <HStack
              spacing={8}
              justify="center"
              align="center"
              mt={{ base: 6, sm: 0 }}
              mb={{ base: 6, sm: 0 }}
            >
              <FooterLink href="/user-terms">
                <HStack align="center" role="group">
                  <Text as="span">User Terms</Text>
                  <ExternalLinkIcon
                    color="purple.base"
                    _groupHover={{
                      color: "neutral.100",
                    }}
                  />
                </HStack>
              </FooterLink>
            </HStack>
            <HStack
              spacing={8}
              justify="center"
              align="center"
              mt={{ base: 6, sm: 0 }}
              mb={{ base: 6, sm: 0 }}
            >
              <FooterLink href="/privacy-policy">
                <HStack align="center" role="group">
                  <Text as="span">Privacy Policy</Text>
                  <ExternalLinkIcon
                    color="purple.base"
                    _groupHover={{
                      color: "neutral.100",
                    }}
                  />
                </HStack>
              </FooterLink>
            </HStack>

            <HStack
              spacing={8}
              justify="center"
              align="center"
              mt={{ base: 6, sm: 0 }}
              mb={{ base: 6, sm: 0 }}
            >
              <FooterLink
                href="https://www.notion.so/Sommelier-Documentation-006e748753e34a1299f9b1d6ae3a4544"
                isExternal
              >
                <HStack align="center" role="group">
                  <Text as="span">Documentation</Text>
                  <ExternalLinkIcon
                    color="purple.base"
                    _groupHover={{
                      color: "neutral.100",
                    }}
                  />
                </HStack>
              </FooterLink>
            </HStack>
            <Socials />
          </Wrap>
        </Flex>
      </Container>
    </Container>
  )
}

export default Footer
