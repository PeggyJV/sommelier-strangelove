import { Flex, Text } from "@chakra-ui/react"
import { Layout } from "components/_layout/Layout"
import type { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <Layout>
      <Flex bg="blue">
        <Text>Main content</Text>
      </Flex>
    </Layout>
  )
}

export default Home
