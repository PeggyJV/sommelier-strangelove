import { Text, TextProps } from "@chakra-ui/react"

export const Label: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text fontSize="10px" color="rgba(115, 113, 122, 1)" {...rest}>
      {children}
    </Text>
  )
}
