import {
  PortableTextComponents,
  PortableTextBlockComponent,
} from "@portabletext/react"
import { Text } from "@chakra-ui/react"

const normal: PortableTextBlockComponent = ({ children }) => (
  <Text fontWeight={400} fontSize={{ base: "1.25rem", lg: "1.5rem" }}>
    {children}
  </Text>
)

const h3: PortableTextBlockComponent = ({ children }) => (
  <Text
    fontSize={{ base: "1.5rem", lg: "2.5rem" }}
    fontWeight={700}
    lineHeight={{ base: "135%", lg: "2.75rem" }}
    pb={10}
  >
    {children}
  </Text>
)

export const PrivacyAndTermsText: PortableTextComponents = {
  block: {
    h3,
    normal,
  },
}
