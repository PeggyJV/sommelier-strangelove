import { Heading, HeadingProps } from "@chakra-ui/react"
import { ReactElement } from "react"

interface Props extends HeadingProps {
  children: string | ReactElement | ReactElement[] | undefined
}

export const HeadingHeavy: React.FC<Props> = ({
  children,
  ...rest
}) => {
  return (
    <Heading
      variant="heavy"
      fontSize={{ base: "4xl", md: "7xl" }}
      lineHeight={{ base: "110%", md: "100%" }}
      letterSpacing={{ base: "-1%", md: "-2%" }}
      {...rest}
    >
      {children}
    </Heading>
  )
}
