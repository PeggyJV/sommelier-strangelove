import { NextPage } from "next"
import { Layout } from "components/_layout/Layout"
import { Container } from "@chakra-ui/react" // Import Container
import { SnapshotCard } from "components/_cards/SnapshotCard"

export const PageSnapshot: NextPage = () => {
  return (
    <Layout>
      <Container maxW="container.xl" centerContent paddingY={8}>
        {/* centerContent centers the child content horizontally, paddingY adds vertical padding */}
        <SnapshotCard />
      </Container>
    </Layout>
  )
}
