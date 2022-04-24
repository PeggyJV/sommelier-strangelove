import { Flex, FlexProps } from "@chakra-ui/react"

export const Tag: React.FC<FlexProps> = ({ children, ...rest }) => {
  return (
    <Flex
      backgroundColor="surface.tertiary"
      borderRadius="4px"
      padding="2px 4px"
      fontSize="xs"
      fontFamily="monospace"
      {...rest}
    >
      {children}
    </Flex>
  )
}
