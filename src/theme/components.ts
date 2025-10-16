import { cssVar, ThemeComponents } from "@chakra-ui/react"

const $arrowShadow = cssVar("popper-arrow-shadow-color")

export const components: ThemeComponents = {
  Button: {
    baseStyle: {
      borderRadius: 64,
      color: "text.body.dark",
      minH: 11,
      px: 4,
      _focusVisible: {
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        outline: "none",
      },
    },
    variants: {
      sommOutline: {
        borderWidth: "2px",
        borderColor: "#7A5AF8",
        bg: "transparent",
        color: "#FFFFFF",
        borderRadius: "9999px",
        h: "40px",
        px: "20px",
        transition:
          "background-color .18s ease, border-color .18s ease, color .18s ease",
        _hover: {
          bg: "rgba(122,90,248,0.08)",
          borderColor: "#9B8AFB",
        },
        _active: {
          bg: "rgba(122,90,248,0.14)",
        },
        _focusVisible: {
          boxShadow: "0 0 0 2px rgba(122,90,248,0.4)",
          outline: "none",
        },
        _disabled: {
          opacity: 0.5,
          cursor: "not-allowed",
        },
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
    parts: ["content"],
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
