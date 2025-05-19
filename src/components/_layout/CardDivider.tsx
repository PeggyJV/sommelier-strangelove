import { StackDivider, StackDividerProps } from "@chakra-ui/react"
import { FC } from "react"

export const CardDivider: FC<StackDividerProps> = (props) => {
  return <StackDivider borderColor="purple.dark" {...props} />
}
