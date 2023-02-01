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
    ".slick-dots li button:before": {
      color: "#EDE8FC",
      "margin-top": "10px !important",
    },
    ".slick-dots li.slick-active button:before": {
      color: "#6C4ED9 !important",
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
    ".nav": {
      top: "0px",
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "500ms",
    },
    ".nav.down": {
      top: "-10rem",
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "500ms",
    },
    ".walletconnect-modal__base": {
      background: "#121214 !important",
      border: "1px solid #6C4ED9 !important",
      borderRadius: "24px !important",
    },
    ".walletconnect-modal__mobile__toggle": {
      background: "#1C182A !important",
      borderRadius: "20px !important",
    },
    ".walletconnect-modal__mobile__toggle_selector": {
      background: "#282045 !important",
      border: "1px solid #6C4ED9 !important",
      borderRadius: "16px !important",
    },
    ".walletconnect-qrcode__text": {
      color: "#fff !important",
    },
    ".walletconnect-connect__button__text": {
      color: "#fff !important",
    },
    ".walletconnect-search__input": {
      background: "#1C182A !important",
    },
  },
}
