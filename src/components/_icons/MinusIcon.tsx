import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const MinusIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 14 12" {...props}>
    <path
      d="M1.428 6h11.143"
      stroke="#F2574D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)
