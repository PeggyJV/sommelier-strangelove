import { Text } from "@chakra-ui/react"

export const Label: React.FC = ({ children, ...rest }) => {
  return (
    <Text fontSize="10px" color="rgba(115, 113, 122, 1)" {...rest}>
      {children}
    </Text>
  )
}
