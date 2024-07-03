import { Link as ChLink } from "@chakra-ui/react"
import NextLink from "next/link"
import LinkProps from "types/LinkProps"

export const Link = ({ children, href, ...rest }: LinkProps) => {
  return (
    <ChLink
      as={NextLink}
      href={href?.toString() || ""}
      textDecoration="none"
      _hover={{ textDecoration: "none" }}
      sx={{
        "&:not(:focus-visible)": {
          boxShadow: "none",
        },
        "&:focus-visible": {
          boxShadow: "0 0 0 3px default",
        },
      }}
      {...rest}
    >
      {children}
    </ChLink>
  )
}
