import { Box, Container, Flex } from "@chakra-ui/react"
import Footer from "components/Footer"
import { Nav } from "components/Nav"
import { Sidebar } from "components/_sidebar"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { FC } from "react"
import { useAccount } from "wagmi"
import { TimeFrameButton } from "./TimeFrameButton"

export const LayoutWithSidebar: FC = ({ children }) => {
  const { isConnected } = useAccount()

  const { isLoading } = useAllStrategiesData()

  return (
    <Box>
      <Box display="block">
        <Flex minH="100vh" bg="#1A1A23" flexDir="column">
          <Nav />
          <Container
            as="main"
            flex={1}
            pt="120px"
            maxW="container.xl"
            px={{ base: "16px", md: "30px", lg: "40px" }}
            flexDir="row"
            justifyContent="center"
          >
            <Flex wrap="wrap-reverse" gap={{ base: "44px", lg: 8 }}>
              <Box w={{ base: "full", lg: "900px" }} flex={7}>
                {children}
              </Box>
              {isConnected && (
                <Box minW={{ base: "full", lg: "300px" }} flex={3}>
                  <Sidebar />
                </Box>
              )}
            </Flex>
            {!isLoading && <TimeFrameButton />}
          </Container>
        </Flex>
        <Footer />
      </Box>
    </Box>
  )
}
