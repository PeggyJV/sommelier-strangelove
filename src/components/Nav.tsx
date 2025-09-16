import { useEffect, useState, memo } from "react"
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Image,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import ConnectButton from "components/_buttons/ConnectButton"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { NAV_LINKS } from "utils/navLinks"
import { LogoTextIcon } from "./_icons"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useScrollDirection } from "hooks/utils/useScrollDirection"
import { HamburgerIcon } from "components/_icons"
import { Badge, BadgeStatus } from "./Strategy/Carousel/Badge"

export const Nav = memo((props: FlexProps) => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const scrollDirection = useScrollDirection()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const routes = useRouter()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")

  // Listen for scroll event to set state
  useEffect(() => {
    const listener = () => {
      setScrolled(window.scrollY >= 80)
    }

    window.addEventListener("scroll", listener)
    return () => {
      window.removeEventListener("scroll", listener)
      setScrolled(false)
    }
  }, [])

  const styles: FlexProps | false = scrolled && {
    bg: "rgba(26, 26, 26, 0.5)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid",
    borderColor: "purple.dark",
  }
  const mobileScrollHide = (!isLarger992 && `nav ${scrollDirection === "down" && "down"}`) || undefined

  return (
    <Flex
      className={mobileScrollHide}
      position="fixed"
      width="100%"
      as="nav"
      py={{ base: "16px", md: "24px", lg: "36px" }}
      fontSize="xl"
      zIndex={1001}
      transition="ease-in-out 200ms"
      transitionProperty="background"
      {...styles}
      {...props}
    >
      <Container
        display="flex"
        maxW="100%"
        justifyContent="space-between"
        alignItems="center"
        flexDir="row"
        gap={{ base: 2, lg: 0 }}
        px={{ base: "8px", md: "24px", lg: "40px" }}
      >
        {/* Desktop Navigation */}
        {isLarger992 && (
          <Flex maxW="calc(100% - 360px)" overflow="hidden" align="center">
            <Link href="/">
              <LogoTextIcon w="9rem" h="2rem" />
            </Link>
            <HStack spacing={{ lg: 6, xl: 10 }} ml={6}>
              {NAV_LINKS.map((item) => {
                const isExternalLink = item.link.startsWith("http")
                let isActive = false

                if (!isExternalLink) {
                  isActive = item.link === "/" ? routes.pathname === "/" : routes.pathname.startsWith(item.link)
                } else {
                  // Define a function with typed parameter to normalize URLs
                  const normalizeUrl = (url: string): string => url.replace(/^(https:\/\/)?(www\.)?/, "")

                  const externalLinks = [
                    "https://somm.finance/",
                    "https://somm.finance/audits",
                    "https://somm.finance/defi",
                    "https://somm.finance/staking",
                  ]
                  const pathSegment = routes.pathname.split("/")[1]

                  // Ensure isActive is always a boolean
                  isActive = externalLinks.some((link) => normalizeUrl(link) === normalizeUrl(item.link))
                    ? false
                    : pathSegment === "strategies"
                    ? false // Set to false instead of empty string to maintain boolean type
                    : pathSegment === item.link.split("/")[1]
                }

                return (
                  <Flex key={item.link} align="center">
                    <Link href={item.link} color={isActive && !isExternalLink ? "white" : "neutral.400"} fontWeight="semibold">
                      {item.title}
                    </Link>
                    {item.isNew && <Badge status={BadgeStatus.New} ml={2} />}
                  </Flex>
                )
              })}
            </HStack>
          </Flex>
        )}

        {/* Mobile Navigation */}
        {!isLarger992 && (
          <>
            <IconButton variant="unstyled" aria-label={"menu"} display={{ base: "flex", lg: "none" }} flex={1} justifyContent="flex-start" onClick={onOpen}>
              <HamburgerIcon />
            </IconButton>
            <Link href="/">
              <Image src="/assets/images/sommelier-icon.svg" alt="somm logo1" height="2rem" />
            </Link>
          </>
        )}

        <Flex flexShrink={0} minW={{ base: "auto", xl: "320px" }} justifyContent="flex-end" overflow="visible" maxW="100%">
          <ConnectButton />
        </Flex>

        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen && !isLarger992}>
          <DrawerOverlay />
          <DrawerContent backgroundColor="#1E163D">
            <DrawerCloseButton size="lg" />
            <DrawerBody p={0}>
              <Stack alignItems="flex-end" py="160px" px="24px">
                {NAV_LINKS.map((item) => {
                  const isExternalLink = item.link.startsWith("http")
                  let isActive = !isExternalLink && (item.link === "/" ? routes.pathname === "/" : routes.pathname.startsWith(item.link))

                  return (
                    <Flex key={item.link} align="center">
                      <Link href={item.link} color={isActive && !isExternalLink ? "white" : "neutral.400"} fontWeight="semibold">
                        {item.title}
                      </Link>
                      {item.isNew && <Badge status={BadgeStatus.New} ml={2} />}
                    </Flex>
                  )
                })}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Flex>
  )
})
