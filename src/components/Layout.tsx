import { VFC } from "react"
import { Box, Container, Flex, FlexProps } from "@chakra-ui/react"
import { BackgroundAssets } from "./BackgroundAssets"
import { Nav } from "./Nav"
import Footer from "./Footer"
import { useAccount, useNetwork } from "wagmi"
import { WrongNetworkBanner } from "./_banners/WrongNetworkBanner"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { MaintenanceBanner } from "./_banners/MaintenanceBanner"

export const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const isMounted = useIsMounted()

  return (
    <Box>
      <Box display="block">
        <BackgroundAssets />
        <Flex minH="100vh" flexDir="column" {...rest}>
          <Nav />
          <Container
            as="main"
            flex={1}
            pt={40}
            maxW="container.lg"
            px={{ base: 0, sm: 4 }}
          >
            {isMounted && isConnected && chain?.id !== 1 && (
              <WrongNetworkBanner />
            )}
            {/* REMOVE IF SUBGRAPH ISSUE FIXED */}
            <MaintenanceBanner />
            {children}
          </Container>
          <Footer />
        </Flex>
      </Box>
    </Box>
  )
}
