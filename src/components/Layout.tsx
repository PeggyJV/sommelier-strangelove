import { VFC } from "react"
import { Box, Container, Flex, FlexProps } from "@chakra-ui/react"
import { useGeo } from "context/geoContext"
import { BackgroundAssets } from "./BackgroundAssets"
import { Nav } from "./Nav"
import { GeoBanner } from "./_banners/GeoBanner"
import Footer from "./Footer"
import { MobileWarningCTA } from "./MobileWarningCTA"

export const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  const { isRestricted } = useGeo() || {}

  return (
    <Box>
      <MobileWarningCTA display={{ base: "flex", md: "none" }} />
      <Box display={{ base: "none", md: "block" }}>
        <BackgroundAssets />
        <Flex minH="100vh" flexDir="column" {...rest}>
          <Nav />
          <Container as="main" flex={1} pt={40} maxW="container.lg">
            {isRestricted && <GeoBanner />}
            {children}
          </Container>
          <Footer />
        </Flex>
      </Box>
    </Box>
  )
}
