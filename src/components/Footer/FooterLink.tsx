import { Link } from "components/Link"
import LinkProps from "types/LinkProps"
import { Text } from "@chakra-ui/react"

interface Props extends LinkProps {
  href: string
}

export const FooterLink: React.FC<Props> = ({
  href,
  children,
  ...rest
}) => {
  return (
    <Link
      href={href}
      _hover={{ textDecoration: "underline" }}
      {...rest}
    >
      <Text fontSize="xs">{children}</Text>
    </Link>
  )
}
