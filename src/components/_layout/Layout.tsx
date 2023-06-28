import { VFC } from "react"
import { Box, Container, Flex, FlexProps } from "@chakra-ui/react"
import { Nav } from "../Nav"
import Footer from "../Footer"
import { useAccount, useNetwork } from "wagmi"
import { WrongNetworkBanner } from "../_banners/WrongNetworkBanner"
import { useIsMounted } from "hooks/utils/useIsMounted"

export const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const isMounted = useIsMounted()

  return (
    <Box bg="#1A1A23">
      <Box display="block">
        <Flex minH="100vh" flexDir="column" {...rest}>
          <Nav />
          <Container
            as="main"
            flex={1}
            pt={40}
            maxW="1300px"
            px={{ base: 0, sm: 4 }}
          >
            {isMounted && isConnected && chain?.id !== 1 && (
              <WrongNetworkBanner />
            )}

            {children}
          </Container>
          <Footer />
        </Flex>
      </Box>
    </Box>
  )
}
