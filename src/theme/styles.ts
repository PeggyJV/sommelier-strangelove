import { Styles } from "@chakra-ui/theme-tools"

export const styles: Styles = {
  global: {
    "html, body": {
      bgColor: "surface.bg",
      color: "neutral.100",
    },
    body: {
      zIndex: "hide",
    },
    a: {
      "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
    },
  },
}
