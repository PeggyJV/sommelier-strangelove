import { Styles } from "@chakra-ui/theme-tools"

export const styles: Styles = {
  global: {
    MozSelection: { background: "purple.base" },
    WebKitSelection: { background: "purple.base" },
    "::selection": { background: "purple.base" },
    "html, body": {
      bgColor: "surface.bg",
      color: "neutral.100",
    },
    ":root": {
      colorScheme: "dark",
    },
    body: {
      zIndex: "hide",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    a: {
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
    },
    "a:focus:not(:focus-visible), div:focus:not(:focus-visible), button:focus:not(:focus-visible)":
      {
        outline: "unset",
        boxShadow: "unset",
      },
    ".blinker": {
      color: "#ED4A7D",
      fontWeight: 100,
    },
    ".slick-prev:before, .slick-next:before": {
      content: '""',
    },
    ".slick-slide": {
      padding: "0 1rem",
    },
    ".blink_me": {
      animation: "blinker 1s linear infinite",
    },
    "@keyframes blinker": {
      "0%": { opacity: 1 },
      "49%": {
        opacity: 1,
      },
      "50%": {
        opacity: 0,
      },
      "100%": {
        opacity: 0,
      },
    },
  },
}
