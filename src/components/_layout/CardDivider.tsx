import { StackDivider, StackDividerProps } from "@chakra-ui/react"
import { VFC } from "react"

export const CardDivider: VFC<StackDividerProps> = (props) => {
  return <StackDivider borderColor="neutral.700" {...props} />
}
