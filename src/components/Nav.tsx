///Users/henriots/Desktop/sommelier-strangelove/src/components/Nav.tsx
import { useEffect, useState, VFC } from "react"
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
  Text,
} from "@chakra-ui/react"
import ConnectButton from "components/_buttons/ConnectButton"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { NAV_LINKS } from "utils/navLinks"
import { LogoTextIcon } from "./_icons"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useScrollDirection } from "hooks/utils/useScrollDirection"
import { HamburgerIcon } from "./_icons/HamburgerIcon"
import { Badge, BadgeStatus } from "./Strategy/Carousel/Badge"

export const Nav: VFC<FlexProps> = (props) => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const scrollDirection = useScrollDirection()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const routes = useRouter()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")

  // listen for scroll event to set state
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    })
    return () => {
      window.removeEventListener("scroll", () => {});
      setScrolled(false);
    }
  }, [])

  const styles: FlexProps | false = scrolled && {
    bg: "rgba(26, 26, 26, 0.5)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid",
    borderColor: "purple.dark",
  }
  const mobileScrollHide =
    (!isLarger992 && `nav ${scrollDirection === "down" && "down"}`) ||
    undefined

  return (
    <Flex
      className={mobileScrollHide}
      position="fixed"
      width="100%"
      as="nav"
      py="36px"
      fontSize="xl"
      zIndex="sticky"
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
        gap={{ base: 4, lg: 0 }}
        px={{ base: "16px", md: "30px", lg: "40px" }}
      >
        {/* Desktop Navigation */}
        {isLarger992 && (
          <HStack spacing={10}>
            <Link href="/">
              <LogoTextIcon w="9rem" h="2rem" />
            </Link>
            {NAV_LINKS.map((item) => {
              // Exclude external links from being marked as active.
              const isExternalLink = item.link.startsWith("http")
              let isActive = false // Declare isActive once before using it

              // Assuming isExternalLink determines if the link is an external URL
              if (!isExternalLink) {
                // Logic from snapshot-branch for internal links
                if (item.link === "/") {
                  // For the home link, check if the pathname is exactly "/"
                  isActive = routes.pathname === "/"
                } else {
                  // For internal links, check if the pathname starts with the link path
                  isActive = routes.pathname.startsWith(item.link)
                }
              } else {
                const pathSegment = routes.pathname.split("/")[1] // Extract the first path segment from pathname
                isActive =
                  (item.link === "https://www.sommelier.finance/" ||
                  item.link ===
                    "https://www.sommelier.finance/audits" ||
                  item.link ===
                    "https://www.sommelier.finance/defi" ||
                  item.link ===
                    "https://www.sommelier.finance/staking"
                    ? false // These specific external links always set isActive to false
                    : pathSegment === "strategies"
                    ? "" // If the current pathSegment is "strategies", it seems to imply isActive should not be true/false but an empty string (though this might require further clarification as it contradicts the boolean nature of isActive)
                    : pathSegment) === item.link.split("/")[1]
              }
              return (
                <Flex key={item.link} align="center">
                  <Link
                    href={item.link}
                    color={
                      isActive && !isExternalLink
                        ? "white"
                        : "neutral.400"
                    }
                    fontWeight="semibold"
                  >
                    {item.title}
                  </Link>
                  {item.isNew && (
                    <Badge status={BadgeStatus.New} ml={2} />
                  )}
                </Flex>
              )
            })}
          </HStack>
        )}

        {!isLarger992 && (
          <>
            <IconButton
              variant="unstyled"
              aria-label={"menu"}
              display={{
                base: "flex",
                lg: "none",
              }}
              flex={1}
              justifyContent="flex-start"
              onClick={onOpen}
            >
              <HamburgerIcon />
            </IconButton>
            <Link href="/">
              <Image
                src="/assets/images/sommelier-icon.svg"
                alt="sommelier logo1"
                height="2rem"
              />
            </Link>
          </>
        )}

        <Flex flex={1} justifyContent="flex-end">
          <ConnectButton />
        </Flex>

        <Drawer
          placement={"left"}
          onClose={onClose}
          isOpen={isOpen && !isLarger992}
        >
          <DrawerOverlay />
          <DrawerContent backgroundColor="#1E163D">
            <DrawerCloseButton size="lg" />
            <DrawerBody p={0}>
              <Stack alignItems="flex-end" py="160px" px="24px">
                {NAV_LINKS.map((item) => {
                  // Exclude external links from being marked as active.
                  const isExternalLink = item.link.startsWith("http")
                  let isActive = false

                  if (!isExternalLink) {
                    if (item.link === "/") {
                      // For the home link, check if the pathname is exactly "/"
                      isActive = routes.pathname === "/"
                    } else {
                      // For internal links, check if the pathname starts with the link path
                      isActive = routes.pathname.startsWith(item.link)
                    }
                  }

                  return (
                    <Flex key={item.link} align="center">
                      <Link
                        href={item.link}
                        color={
                          isActive && !isExternalLink
                            ? "white"
                            : "neutral.400"
                        }
                        fontWeight="semibold"
                      >
                        {item.title}
                      </Link>
                      {item.isNew && (
                        <Badge status={BadgeStatus.New} ml={2} />
                      )}
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
}
