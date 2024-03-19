import { NextPage } from "next"
import { Layout } from "components/_layout/Layout"
import { Center } from "@chakra-ui/react"
import { SnapshotCard } from "components/_cards/SnapshotCard"

export const PageSnapshot: NextPage = () => {
  return (
    <Layout>
      <Center>
        <SnapshotCard />
      </Center>
    </Layout>
  )
}
