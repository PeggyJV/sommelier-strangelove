import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const ArrowDownFillIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 8 8" {...props}>
    <path
      d="M.063 1.577l3.429 5.429a.629.629 0 001.006 0l3.428-5.429a.571.571 0 000-.571.606.606 0 00-.508-.28H.549a.606.606 0 00-.508.28.571.571 0 00.022.571z"
      fill="#F2574D"
    />
  </Icon>
)
