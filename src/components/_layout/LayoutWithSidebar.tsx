import { Box, Container, Flex } from "@chakra-ui/react"
import Footer from "components/Footer"
import { Nav } from "components/Nav"
import { Sidebar } from "components/_sidebar"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { FC, useRef } from "react"
import { useAccount } from "wagmi"
import { TimeFrameButton } from "./TimeFrameButton"
import { useInView } from "react-intersection-observer"

export const LayoutWithSidebar: FC = ({ children }) => {
  const { isConnected } = useAccount()

  const { isLoading } = useAllStrategiesData()

  const containerRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView({
    threshold: 0,
  })
  return (
    <Box display="block">
      <Flex bg="#1A1A23" flexDir="column" position="relative">
        <Nav />
        <Container
          as="main"
          flex={1}
          pt={{ base: "120px", lg: "140px" }}
          maxW="1460px"
          px={{ base: "16px", md: "30px", lg: "40px" }}
          flexDir="row"
          justifyContent="center"
        >
          <Flex
            wrap="wrap-reverse"
            gap={{ base: "44px", lg: 8 }}
            pb={8}
          >
            <Box
              w={{ base: "full", lg: "900px" }}
              flex={7}
              ref={containerRef}
            >
              {children}
            </Box>
            {isConnected && (
              <Box minW={{ base: "full", lg: "300px" }} flex={3}>
                <Sidebar />
              </Box>
            )}
          </Flex>
        </Container>
        <Box height={40}>
          {!isLoading && <TimeFrameButton inView={inView} />}
        </Box>
      </Flex>
      <Box ref={ref}>
        <Footer />
      </Box>
    </Box>
  )
}
