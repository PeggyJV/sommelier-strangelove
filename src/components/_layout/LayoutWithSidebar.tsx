import { Box, Container, Flex } from "@chakra-ui/react"
import Footer from "components/Footer"
import { Nav } from "components/Nav"
import { Sidebar } from "components/_sidebar"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import { useInView } from "react-intersection-observer"

export const LayoutWithSidebar: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isConnected: connected } = useAccount()

  const containerRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView({
    threshold: 0,
  })

  // using local state to avoid Next.js errors
  const [isConnected, setConnected] = useState(false)
  useEffect(() => {
    setConnected(connected)
  }, [connected])

  // Temporarily disabled – only needed once multiple vault groups exist
  const hasSidebar = false

  return (
    <Box display="block">
      <Flex bg="#1A1A23" flexDir="column" position="relative">
        <Nav />
        <Container
          as="main"
          flex={1}
          pt={{ base: "120px", lg: "140px" }}
          maxW="2000px"
          px={{ base: "8px", md: "16px", lg: "30px" }}
          flexDir="row"
          justifyContent="center"
        >
          <Flex
            flexDir={{ base: "column-reverse", xl: "row" }}
            gap={{ base: "44px", lg: 8 }}
            pb={8}
          >
            <Box
              w={{ base: "full", xl: hasSidebar ? "900px" : "full" }}
              flex={hasSidebar ? 7 : 1}
              ref={containerRef}
            >
              {children}
            </Box>
            {hasSidebar && (
              <Box minW={{ base: "full", lg: "300px" }} flex={3}>
                <Sidebar />
              </Box>
            )}
          </Flex>
        </Container>
      </Flex>
      <Box ref={ref}>
        <Footer />
      </Box>
    </Box>
  )
}
