import { Heading, TextProps } from "@chakra-ui/react"

export const Label: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Heading
      as="p"
      fontSize="10px"
      color="neutral.500"
      fontWeight="600"
      {...rest}
    >
      {children}
    </Heading>
  )
}
