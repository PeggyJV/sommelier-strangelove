import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const PlusIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 14 14" {...props}>
    <path
      d="M7 1.463v11.143M1.428 7h11.143"
      stroke="#BCE051"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)
