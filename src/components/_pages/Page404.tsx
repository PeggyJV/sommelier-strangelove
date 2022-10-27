import { NextPage } from "next"
import { Center, Heading, VStack } from "@chakra-ui/react"
import { Link } from "components/Link"

export const Page404: NextPage = () => {
  return (
    <Center height="100vh">
      <VStack>
        <Heading>404 Not Found</Heading>
        <Link textDecoration="underline" href={"/"}>
          Back to home page
        </Link>
      </VStack>
    </Center>
  )
}
