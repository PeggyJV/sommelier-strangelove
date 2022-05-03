import { useEffect, useState, VFC } from "react"
import { Container, Flex, FlexProps } from "@chakra-ui/react"
import { useConnect } from "wagmi"
import ConnectButton from "components/_buttons/ConnectButton"
import { Link } from "components/Link"
import { LogoTextIcon } from "components/_icons"

export const Nav: VFC<FlexProps> = (props) => {
  const [auth] = useConnect()
  const [scrolled, setScrolled] = useState<boolean>(false)

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
    borderColor: "purple.base",
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
        <Link href="/">
          <LogoTextIcon
            w="9rem"
            h="2rem"
            _hover={{ color: "red.base" }}
          />
        </Link>
        {auth.data.connectors.map((c) => (
          <ConnectButton connector={c} key={c.id} />
        ))}
      </Container>
    </Flex>
  )
}
