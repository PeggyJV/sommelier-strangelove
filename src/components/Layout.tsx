import { VFC } from "react"
import { Nav } from "./Nav"
import {
  Container,
  Flex,
  FlexProps,
  useMediaQuery,
} from "@chakra-ui/react"
import Footer from "./Footer"
import { BackgroundAssets } from "./BackgroundAssets"
import { useGeo } from "context/geoContext"
import { GeoBanner } from "components/_banners/GeoBanner"
import { MobileWarningCTA } from "./MobileWarningCTA"

export const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  const { isRestricted } = useGeo() || {}
  const [isMobile] = useMediaQuery("(max-width: 480px)")

  return isMobile ? (
    <MobileWarningCTA />
  ) : (
    <>
      <BackgroundAssets />
      <Flex minH="100vh" flexDir="column" {...rest}>
        <Nav />
        <Container as="main" flex={1} pt={40} maxW="container.lg">
          {isRestricted && <GeoBanner />}
          {children}
        </Container>
        <Footer />
      </Flex>
    </>
  )
}
