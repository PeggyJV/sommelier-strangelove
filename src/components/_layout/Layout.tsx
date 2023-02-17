import { Box, Container, Flex } from "@chakra-ui/react"
import Footer from "components/Footer"
import { Nav } from "components/Nav"
import { Sidebar } from "components/_sidebar"
import { rest } from "lodash"
import { FC } from "react"
import { useAccount } from "wagmi"

export const Layout: FC = ({ children }) => {
  const { isConnected } = useAccount()
  return (
    <Box>
      <Box display="block">
        <Flex minH="100vh" bg="#1A1A23" flexDir="column" {...rest}>
          <Nav />
          <Container
            as="main"
            flex={1}
            pt="120px"
            maxW="container.xl"
            px={{ base: "16px", md: "30px", lg: "40px" }}
            flexDir="row"
          >
            <Flex wrap="wrap-reverse" gap={{ base: "44px", lg: 8 }}>
              <Box w={{ base: "full", lg: "700px" }} flex={7}>
                {children}
              </Box>
              {isConnected && (
                <Box minW={{ base: "full", lg: "300px" }} flex={3}>
                  <Sidebar />
                </Box>
              )}
            </Flex>
          </Container>
        </Flex>
        <Footer />
      </Box>
    </Box>
  )
}
