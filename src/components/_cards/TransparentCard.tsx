import { BoxProps } from "@chakra-ui/react"
import { VFC } from "react"
import { Card } from "./Card"

export const TransparentCard: VFC<BoxProps> = (props) => {
  return (
    <Card
      bg="surface.primary"
      borderWidth={1}
      borderRadius={24}
      borderColor="surface.secondary"
      backdropFilter="blur(8px)"
      {...props}
    />
  )
}
