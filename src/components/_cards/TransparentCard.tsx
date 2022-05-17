import { BoxProps } from "@chakra-ui/react"
import React, { VFC } from "react"
import { Card } from "./Card"

const TransparentCard: VFC<BoxProps> = (props) => {
  return (
    <Card
      bg="surface.primary"
      borderWidth={1}
      borderRadius={16}
      borderColor="surface.secondary"
      backdropFilter="blur(8px)"
      {...props}
    />
  )
}

export default TransparentCard
