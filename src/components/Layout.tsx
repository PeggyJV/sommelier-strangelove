import { VFC } from "react"
import { Box, Container, Flex, FlexProps } from "@chakra-ui/react"
import { useGeo } from "context/geoContext"
import { BackgroundAssets } from "./BackgroundAssets"
import { Nav } from "./Nav"
import { GeoBanner } from "./_banners/GeoBanner"
import Footer from "./Footer"
import { MobileWarningCTA } from "./MobileWarningCTA"
import { useAccount, useNetwork } from "wagmi"
import { WrongNetworkBanner } from "./_banners/WrongNetworkBanner"
import { useRouter } from "next/router"

export const Layout: VFC<FlexProps> = ({ children, ...rest }) => {
  const { isRestricted } = useGeo() || {}
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const router = useRouter()

  const isHomeOrStrategiesLandingPage =
    router.pathname === "/" ||
    (router.pathname.split("/")[1]?.toLowerCase() === "strategies" &&
      router.pathname.split("/")[3]?.toLowerCase() !== "manage")

  return (
    <Box>
      <MobileWarningCTA
        display={{
          base: isHomeOrStrategiesLandingPage ? "none" : "flex",
          md: "none",
        }}
      />
      <Box
        display={{
          base: isHomeOrStrategiesLandingPage ? "block" : "none",
          md: "block",
        }}
      >
        <BackgroundAssets />
        <Flex minH="100vh" flexDir="column" {...rest}>
          <Nav />
          <Container as="main" flex={1} pt={40} maxW="container.lg">
            {isRestricted && <GeoBanner />}
            {isConnected && chain?.id !== 1 && <WrongNetworkBanner />}
            {children}
          </Container>
          <Footer />
        </Flex>
      </Box>
    </Box>
  )
}
