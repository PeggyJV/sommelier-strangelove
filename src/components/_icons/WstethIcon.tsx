import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const WstethIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 20 28" {...props}>
    <circle cx="9.8" cy="14" r="13" fill="#FFFFFF"/>
    <path
      fill="#00A3FF"
      d="M1.7,11.7L1.5,12c-2.3,3.6-1.8,8.3,1.3,11.3C4.5,25.1,6.9,26,9.3,26C9.3,26,9.3,26,1.7,11.7z"
    />
    <path
      opacity="0.6"
      fill="#00A3FF"
      enableBackground="new"
      d="M9.3,16l-7.6-4.4C9.3,26,9.3,26,9.3,26C9.3,22.9,9.3,19.3,9.3,16z"
    />
    <path
      opacity="0.6"
      fill="#00A3FF"
      enableBackground="new"
      d="M16.9,11.7l0.2,0.3c2.3,3.6,1.8,8.3-1.3,11.3C14,25.1,11.7,26,9.3,26C9.3,26,9.3,26,16.9,11.7z"
    />
    <path
      opacity="0.2"
      fill="#00A3FF"
      enableBackground="new"
      d="M9.3,16l7.6-4.4C9.3,26,9.3,26,9.3,26C9.3,22.9,9.3,19.3,9.3,16z"
    />
    <path
      opacity="0.2"
      fill="#00A3FF"
      enableBackground="new"
      d="M9.3,6.3v7.5l6.6-3.7L9.3,6.3z"
    />
    <path
      opacity="0.6"
      fill="#00A3FF"
      enableBackground="new"
      d="M9.3,6.3l-6.6,3.8l6.6,3.7V6.3z"
    />
    <path fill="#00A3FF" d="M9.3,0L2.7,10.1l6.6-3.8V0z" />
    <path
      opacity="0.6"
      fill="#00A3FF"
      enableBackground="new"
      d="M9.3,6.3l6.6,3.8L9.3,0V6.3z"
    />
  </Icon>
)
