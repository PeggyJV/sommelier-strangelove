import type { NextPage } from "next"
import { Center, Heading, VStack } from "@chakra-ui/react"

const Home: NextPage = () => {
  return (
    <Center height="100vh">
      <VStack>
        <Heading textAlign="center">
          We've encountered a temporary issue with the front end. A
          fix is in progress. User funds are safe.
        </Heading>
      </VStack>
    </Center>
  )
}

export default Home
