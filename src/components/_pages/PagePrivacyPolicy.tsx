import { Box, Heading } from "@chakra-ui/react"
import { PortableText } from "@portabletext/react"
import { Layout } from "components/Layout"
import { PrivacyAndTermsText } from "components/PortableText/PrivacyAndTermsText"
import { NextPage } from "next"
import { PrivacyPolicyProps } from "pages/privacy-policy"

const PagePrivacyPolicy: NextPage<PrivacyPolicyProps> = ({
  data,
}) => {
  return (
    <Layout>
      <Box
        zIndex="2"
        position="relative"
        maxW={{
          sm: "37.5rem",
          lg: "70rem",
        }}
        paddingTop="4rem"
      >
        <Heading
          marginBottom={{
            base: 10,
            lg: 20,
          }}
          fontSize={{
            base: "3.375rem",
            md: "2.5rem",
            lg: "5.25rem",
          }}
          fontWeight={900}
        >
          Privacy Policy
        </Heading>
        <Box w={{ base: "auto", lg: "42.75rem" }} maxW="container.xl">
          {data?.content && (
            <PortableText
              value={data.content}
              components={{ ...PrivacyAndTermsText }}
            />
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default PagePrivacyPolicy
