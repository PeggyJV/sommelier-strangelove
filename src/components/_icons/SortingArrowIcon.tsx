import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const SortingArrowIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 8 12" {...props}>
    <path
      d="M6.876 7.457a.429.429 0 00-.609 0l-2.19 2.19a.107.107 0 01-.154 0l-2.19-2.19a.429.429 0 10-.609.604l2.422 2.422a.643.643 0 00.908 0L6.876 8.06a.429.429 0 000-.604v0zM1.124 4.543a.429.429 0 00.609 0l2.19-2.19a.107.107 0 01.154 0l2.19 2.19a.429.429 0 10.609-.604L4.454 1.517a.643.643 0 00-.908 0L1.124 3.94a.429.429 0 000 .604v0z"
      fill="#9E9DA3"
      stroke="#9E9DA3"
    />
  </Icon>
)
