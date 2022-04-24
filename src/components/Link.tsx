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
        {...rest}
      >
        {children}
      </ChLink>
    </NLink>
  )
}
