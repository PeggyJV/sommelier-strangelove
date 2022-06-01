import { cssVar, ThemeComponents } from "@chakra-ui/react"

const $arrowShadow = cssVar("popper-arrow-shadow-color")

export const components: ThemeComponents = {
  Button: {
    baseStyle: {
      borderRadius: 64,
      color: "text.body.dark",
    },
  },
  Heading: {
    baseStyle: {
      color: "text.headlines.light",
    },
  },
  Tooltip: {
    baseStyle: {
      px: 3,
      py: 3,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: "purple.base",
      [$arrowShadow.variable]: "colors.purple.base",
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "purple.base",
    },
  },
}
