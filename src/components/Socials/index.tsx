import { HStack, Icon, StackProps } from "@chakra-ui/react"
import { Link } from "components/Link"
import { VFC } from "react"
import { links } from "./links"

export const Socials: VFC<StackProps> = ({ ...rest }) => {
  return (
    <HStack spacing={4} {...rest}>
      {links.map((social, i) => {
        const { href, icon } = social
        return (
          <Link key={i} href={href} display="flex" isExternal>
            <Icon
              as={icon}
              boxSize={10}
              p={2}
              color="white"
              bg="surface.primary"
              borderWidth={4}
              borderRadius={16}
              borderColor="surface.secondary"
              _hover={{
                bg: "purple.dark",
              }}
            />
          </Link>
        )
      })}
    </HStack>
  )
}
