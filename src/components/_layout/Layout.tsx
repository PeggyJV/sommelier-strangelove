import { VFC } from "react"
import { Box, Container, Flex, FlexProps } from "@chakra-ui/react"
import { Nav } from "../Nav"
import Footer from "../Footer"
import { useAccount } from "wagmi"
import { WrongNetworkBanner } from "../_banners/WrongNetworkBanner"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { Chain } from "src/data/chainConfig"

interface LayoutProps extends FlexProps {
  chainObj?: Chain
}

export const Layout: VFC<LayoutProps> = ({ chainObj, children, ...rest }) => {
  const { isConnected } = useAccount()
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
            {isMounted && isConnected && (
              <WrongNetworkBanner chain={chainObj} />
            )}

            {children}
          </Container>
          <Footer />
        </Flex>
      </Box>
    </Box>
  )
}
