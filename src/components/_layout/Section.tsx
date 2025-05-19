import { Box, BoxProps } from "@chakra-ui/react"
import { FC } from "react"

export const Section: FC<BoxProps> = (props) => {
  return <Box as="section" pb={12} px={4} {...props} />
}
