import { Link as ChLink } from "@chakra-ui/react"
import NLink from "next/link"
import LinkProps from "types/LinkProps"

export const Link = ({ children, href, ...rest }: LinkProps) => {
  return (
    <NLink href={href || ""} passHref>
      {/* @ts-ignore */}
      <ChLink
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
    </NLink>
  )
}
