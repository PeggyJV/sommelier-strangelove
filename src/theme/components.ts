import { cssVar, ThemeComponents } from "@chakra-ui/react"

const $arrowShadow = cssVar("popper-arrow-shadow-color")

export const components: ThemeComponents = {
  Button: {
    baseStyle: {
      borderRadius: 64,
      color: "text.body.dark",
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
    },
  },
  Link: {
    baseStyle: {
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
    },
  },
  IconButton: {
    baseStyle: {
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
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
  Popover: {
    baseStyle: {
      content: {
        _focusVisible: {
          boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
          outline: "none",
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "purple.base",
    },
    baseStyle: {
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        _focusVisible: {
          boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
          outline: "none",
        },
      },
    },
  },
  Textarea: {
    baseStyle: {
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
    },
  },
}
