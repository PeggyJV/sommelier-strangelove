import { HStack, StackProps, Text } from "@chakra-ui/react"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"
import { VFC } from "react"
import { links } from "./links"

export const Socials: VFC<StackProps> = ({ ...rest }) => {
  return (
    <HStack spacing={8} {...rest}>
      {links.map((social, i) => {
        const { href, title } = social
        return (
          <Link
            key={i}
            href={href}
            display="flex"
            role="group"
            isExternal
            _hover={{ textDecoration: "underline" }}
          >
            <HStack align="center">
              <Text as="span" textTransform="capitalize">
                {title}
              </Text>
              <ExternalLinkIcon
                color="purple.base"
                _groupHover={{
                  color: "neutral.100",
                }}
              />
            </HStack>
          </Link>
        )
      })}
    </HStack>
  )
}
