import {
  PortableTextBlockComponent,
  PortableTextListComponent,
  PortableTextListItemComponent,
} from "@portabletext/react"

import { Heading, List, ListItem, Text } from "@chakra-ui/react"

const h1: PortableTextBlockComponent = ({ children }) => (
  <Heading
    fontSize={{ base: "4xl", md: "8xl" }}
    lineHeight={{ base: "115%", md: "100%" }}
    letterSpacing="-2px"
    as="h1"
    maxW="45rem"
    fontWeight={{ base: "700", lg: "900" }}
    mb={{ base: 6, md: 10 }}
  >
    {children}
  </Heading>
)

const h2: PortableTextBlockComponent = ({ children }) => (
  <Heading
    fontSize={{ base: "2rem", md: "2.5rem", lg: "3.2rem" }}
    lineHeight={{ base: "2.5rem", md: "3rem", lg: "3.75rem" }}
    as="h2"
    maxW="50rem"
  >
    {children}
  </Heading>
)

const normal: PortableTextBlockComponent = ({ children }) => (
  <Text
    fontSize={{ base: "button", md: "2xl" }}
    as="p"
    _notLast={{ marginBottom: "2rem" }}
  >
    {children}
  </Text>
)

const list: PortableTextListComponent = ({ children }) => (
  <List fontSize="1rem" mb="2rem" listStyleType="disc" ml={4}>
    {children}
  </List>
)

const listItem: PortableTextListItemComponent = ({ children }) => (
  <ListItem fontSize="1rem" _notLast={{ marginBottom: "0.5rem" }}>
    {children}
  </ListItem>
)

export const FAQStrategyComponents = {
  block: {
    h1,
    h2,
    normal,
  },
  list,
  listItem,
}
