import { Styles } from "@chakra-ui/theme-tools"

export const styles: Styles = {
  global: {
    "html, body": {
      bgColor: "surface.bg",
      color: "neutral.100",
    },
    body: {
      zIndex: "hide",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    a: {
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
    },
    // "a:focus:not(:focus-visible), div:focus:not(:focus-visible), button:focus:not(:focus-visible)":
    //   {
    //     outline: "unset",
    //     boxShadow: "unset",
    //   },
  },
}
