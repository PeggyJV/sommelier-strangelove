import { Link } from "components/Link"
import LinkProps from "types/LinkProps"

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
      fontSize="xs"
      {...rest}
    >
      {children}
    </Link>
  )
}
