import { useEffect, useState, VFC } from "react"
import {
  Container,
  Flex,
  FlexProps,
  HStack,
  Image,
} from "@chakra-ui/react"
import { useConnect } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"
import { Link } from "components/Link"
import { useRouter } from "next/router"
import { NAV_LINKS } from "utils/navLinks"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { LogoTextIcon } from "./_icons"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"

export const Nav: VFC<FlexProps> = (props) => {
  const isMounted = useIsMounted()
  const { connectors } = useConnect()
  const [scrolled, setScrolled] = useState<boolean>(false)

  const routes = useRouter()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")

  // listen for scroll event to set state
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    })
  }, [])

  const styles: FlexProps | false = scrolled && {
    bg: "rgba(26, 26, 26, 0.5)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid",
    borderColor: "purple.dark",
  }

  return (
    <Flex
      position="fixed"
      width="100%"
      as="nav"
      py={4}
      fontSize="xl"
      zIndex="sticky"
      transition="ease-in-out 200ms"
      transitionProperty="background"
      {...styles}
      {...props}
    >
      <Container
        display="flex"
        maxW="container.xl"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={10}>
          <Link href="/">
            {isMounted &&
              (isLarger768 ? (
                <LogoTextIcon w="9rem" h="2rem" />
              ) : (
                <Image
                  src="/assets/images/sommelier-icon.svg"
                  alt="sommelier logo1"
                  height="2rem"
                />
              ))}
          </Link>
          <HStack
            spacing={8}
            px={4}
            py={3}
            bgColor="surface.primary"
            borderRadius="16px"
          >
            {NAV_LINKS.map((item) => {
              const path = routes.pathname.split("/")[1]

              const isActive =
                (path === "strategies" ? "" : path) ===
                item.link.split("/")[1]
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
        </HStack>

        {isLarger768 &&
          connectors.map((c) => (
            <ConnectButton connector={c} key={c.id} />
          ))}
      </Container>
    </Flex>
  )
}
