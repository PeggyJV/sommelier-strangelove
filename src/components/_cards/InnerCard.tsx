import { BoxProps } from "@chakra-ui/react"
import { FC } from "react"
import { Card } from "./Card"

export const InnerCard: FC<BoxProps> = (props) => {
  return (
    <Card
      bg="surface.secondary"
      borderWidth={1}
      borderRadius={16}
      borderColor="surface.secondary"
      backdropFilter="blur(8px)"
      {...props}
    />
  )
}
