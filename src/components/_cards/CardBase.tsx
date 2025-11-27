import { Flex, FlexProps } from "@chakra-ui/react"
import { ReactElement } from "react"

interface Props extends FlexProps {
  children: ReactElement<any> | ReactElement<any>[]
}
export const CardBase: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <Flex
      border="1px solid"
      borderColor="border.subtle"
      backgroundColor="brand.surface"
      borderRadius="lg"
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
