import { HStack, Icon, StackProps } from "@chakra-ui/react"
import { Link } from "components/Link"
import { VFC } from "react"
import { links } from "./links"

export const Socials: VFC<StackProps> = () => {
  return (
    <HStack spacing={4}>
      {links.map((social, i) => {
        const { href, icon } = social
        return (
          <Link key={i} href={href} isExternal>
            <Icon
              as={icon}
              boxSize={9}
              p={2}
              color="white"
              bg="backgrounds.black"
              borderRadius="50%"
              _hover={{
                bg: "sunsetOrange",
              }}
            />
          </Link>
        )
      })}
    </HStack>
  )
}
