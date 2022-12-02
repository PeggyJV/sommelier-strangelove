import { NextPage } from "next"
import { Layout } from "components/Layout"
import { Center } from "@chakra-ui/react"

import { BridgeCard } from "components/_cards/BridgeCard"
import { MobileWarningCTA } from "components/MobileWarningCTA"

export const PageBridge: NextPage = () => {
  return (
    <Layout>
      <MobileWarningCTA
        display={{ base: "flex", md: "none" }}
        text="Bridge UI is not supported by mobile yet. Please use a desktop for Bridge UI"
      />
      <Center display={{ base: "none", md: "flex" }}>
        <BridgeCard />
      </Center>
    </Layout>
  )
}
