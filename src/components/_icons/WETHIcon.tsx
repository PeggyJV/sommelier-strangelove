import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const WETHICon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 2500 2485" {...props}>
    {/* Existing elements */}
    <circle cx="9.8" cy="14" r="13" fill="#FFFFFF" />

    {/* Extracted path */}
    <path
      fill="#00A3FF"
      d="M1096 2485 c-252 -36 -486 -141 -659 -295 -35 -32 -54 -56 -50 -63 4 -7 8 -16 8 -22 1 -5 7 -9 14 -7 8 2 -9 -23 -36 -55 -202 -234 -297 -489 -297 -793 0 -321 107 -587 331 -821 174 -182 397 -298 670 -349 54 -10 91 -19 82 -19 -12 -1 -15 -8 -12 -25 4 -20 12 -24 56 -29 27 -4 96 -2 151 4 181 18 308 54 458 131 243 124 435 319 553 562 198 407 166 867 -88 1246 -64 96 -231 263 -327 327 -256 171 -571 248 -854 208z"
    />

    {/* Other paths */}
    {/* ... */}
  </Icon>
)

export default WETHICon
