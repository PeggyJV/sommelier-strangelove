import { Icon, IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export const GHOIcon: VFC<IconProps> = (props) => (
  <Icon viewBox="0 0 100 100" {...props}>
    <defs>
      <clipPath id="circleClip">
        <circle cx="50" cy="50" r="48" />
      </clipPath>
    </defs>

    <circle cx="50" cy="50" r="48" fill="#c8b4f9" />
    <g clip-path="url(#circleClip)">
      <g transform="translate(0, 100) scale(0.17, -0.17)">
        <path
          d="M0 320 l0 -320 320 0 320 0 0 320 0 320 -320 0 -320 0 0 -320z m384 145 c9 -13 16 -27 16 -30 0 -3 -31 -5 -69 -5 -38 0 -81 -4 -95 -10 -28 -10 -66 -64 -66 -93 0 -33 30 -84 56 -96 26 -12 194 -16 194 -4 0 3 -11 26 -25 50 l-26 43 38 0 c36 0 41 -4 71 -54 18 -31 32 -68 32 -86 l0 -32 -143 3 c-136 4 -146 6 -184 31 -89 59 -100 192 -21 265 34 32 65 42 139 42 60 1 68 -1 83 -24z m-96 -93 c4 -28 -24 -41 -44 -20 -20 20 -7 50 20 46 13 -2 22 -12 24 -26z m0 -90 c4 -28 -24 -41 -44 -20 -20 20 -7 50 20 46 13 -2 22 -12 24 -26z"
          fill="#000000"
        />
      </g>
    </g>
  </Icon>
)
