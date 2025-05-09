import { BoxProps } from "@chakra-ui/react"
import { FC } from "react"
import { Card } from "./Card"

export const TransparentCard: FC<BoxProps> = (props) => {
  return (
    <Card
      backgroundColor="surface.primary"
      borderWidth={1}
      borderRadius={{ base: 0, sm: 24 }}
      borderColor="surface.secondary"
      backdropFilter="blur(8px)"
      {...props}
    />
  )
}
