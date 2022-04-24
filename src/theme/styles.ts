import { Styles } from "@chakra-ui/theme-tools"

export const styles: Styles = {
  global: {
    "html, body": {
      bgColor: "backgrounds.offBlack",
      color: "text.body.light",
    },
    body: {
      zIndex: "hide",
    },
    a: {
      "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
    },
  },
}
