import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const HamburgerIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 26 22" {...props}>
    <path
      d="M24.1429 2.42871H1.85718"
      stroke="#FAFAFC"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.1429 11H1.85718"
      stroke="#FAFAFC"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.1429 19.5718H1.85718"
      stroke="#FAFAFC"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)
