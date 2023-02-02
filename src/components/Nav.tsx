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
} from "@chakra-ui/react"
import ConnectButton from "components/_buttons/ConnectButton"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { NAV_LINKS } from "utils/navLinks"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { LogoTextIcon } from "./_icons"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useScrollDirection } from "hooks/utils/useScrollDirection"
import { HamburgerIcon } from "./_icons/HamburgerIcon"

export const Nav: VFC<FlexProps> = (props) => {
  const isMounted = useIsMounted()
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
      window.removeEventListener("scroll", () => {})
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
        maxW="1452px"
        justifyContent="space-between"
        alignItems="center"
        flexDir="row"
        gap={{ base: 4, lg: 0 }}
        px={{ base: "16px", md: "30px", lg: "40px" }}
      >
        {isLarger992 && (
          <HStack spacing={10}>
            <Link href="/">
              <LogoTextIcon w="9rem" h="2rem" />
            </Link>
            {NAV_LINKS.map((item) => {
              const path = routes.pathname.split("/")[1]

              const isActive =
                (item.link === "https://www.sommelier.finance/"
                  ? false
                  : path === "strategies"
                  ? ""
                  : path) === item.link.split("/")[1]

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  color={isActive ? "white" : "neutral.400"}
                  fontWeight="semibold"
                >
                  {item.title}
                </Link>
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
<<<<<<< HEAD
              {NAV_LINKS.map((item) => {
                const path = routes.pathname.split("/")[1]
                const isExternal = item.link.includes(
                  "https://www.sommelier.finance"
                )
                const isActive =
                  (isExternal
                    ? false
                    : path === "strategies"
                    ? ""
                    : path) === item.link.split("/")[1]

                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    color={isActive ? "white" : "neutral.400"}
                    fontWeight="semibold"
                  >
                    {item.title}
                  </Link>
                )
              })}
            </HStack>
          )}
        </HStack>
        <HStack justifyContent="flex-end">
          <ConnectButton />
          <IconButton
            variant="unstyled"
            aria-label={"menu"}
            display={["flex", "flex", "none", "none"]}
            onClick={onOpen}
          >
            <HamburgerIcon />
          </IconButton>
          <Drawer
            placement={"right"}
            onClose={onClose}
            isOpen={isOpen && !isLarger768}
          >
            <DrawerOverlay />
            <DrawerContent backgroundColor="#1E163D">
              <DrawerCloseButton size="lg" />
              <DrawerBody p={0}>
                <Stack alignItems="flex-end" py="160px" px="24px">
                  {NAV_LINKS.map((item) => {
                    const path = routes.pathname.split("/")[1]
                    const isExternal = item.link.includes(
                      "https://www.sommelier.finance"
                    )
                    const isActive =
                      (isExternal
                        ? false
                        : path === "strategies"
                        ? ""
                        : path) === item.link.split("/")[1]

                    return (
                      <Link
                        key={item.link}
                        href={item.link}
                        color={isActive ? "white" : "neutral.400"}
                        fontWeight="semibold"
                        fontSize="21px"
                      >
                        {item.title}
                      </Link>
                    )
                  })}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </HStack>
=======
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
                  const path = routes.pathname.split("/")[1]

                  const isActive =
                    (item.link === "https://www.sommelier.finance/"
                      ? false
                      : path === "strategies"
                      ? ""
                      : path) === item.link.split("/")[1]
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      color={isActive ? "white" : "neutral.400"}
                      fontWeight="semibold"
                      fontSize="21px"
                    >
                      {item.title}
                    </Link>
                  )
                })}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
>>>>>>> c352894 (redesign and refactor overview page v2)
      </Container>
    </Flex>
  )
}
