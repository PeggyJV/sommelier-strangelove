import { Flex, FlexProps } from "@chakra-ui/react"
import { ReactNode } from "react"

interface Props extends FlexProps {
  children: ReactNode
}
export const CardBase: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <Flex
      border="1px solid"
      borderColor="surface.tertiary"
      backgroundColor="surface.secondary"
      borderRadius="16px"
      alignItems="center"
      backdropFilter="blur(5px)"
      px={6}
      py={4}
      {...rest}
    >
      {children}
    </Flex>
  )
}
