import { NextPage } from "next"
import { Layout } from "components/_layout/Layout"
import { Center } from "@chakra-ui/react"

import { BridgeCard } from "components/_cards/BridgeCard"

export const PageBridge: NextPage = () => {
  return (
    <Layout>
      <Center>
        <BridgeCard />
      </Center>
    </Layout>
  )
}
