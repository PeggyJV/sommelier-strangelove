import { FC } from "react"
import { Box, BoxProps } from "@chakra-ui/react"

export type CardProps = FC<BoxProps>

export const Card: CardProps = (props) => {
  return (
    <Box
      direction="column"
      p={4}
      borderRadius="lg"
      overflow="hidden"
      bg="brand.surface"
      border="1px solid"
      borderColor="border.subtle"
      {...props}
    />
  )
}
