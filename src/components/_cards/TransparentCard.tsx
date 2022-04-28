import { BoxProps } from "@chakra-ui/react"
import React, { VFC } from "react"
import { Card } from "./Card"

const TransparentCard: VFC<BoxProps> = (props) => {
  return (
    <Card
      bg="backgrounds.glassyPurple"
      borderWidth={8}
      borderRadius={16}
      borderColor="backgrounds.glassy"
      {...props}
    />
  )
}

export default TransparentCard
