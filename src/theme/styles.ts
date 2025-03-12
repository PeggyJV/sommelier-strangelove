// import { Styles } from "@chakra-ui/theme-tools"

// Define global styles for Chakra UI v3
export const globalStyles = {
  // Selection styles
  "::selection": { background: "purple.base" },
  "::-moz-selection": { background: "purple.base" },
  "::-webkit-selection": { background: "purple.base" },

  // HTML and body styles
  "html, body": {
    backgroundColor: "surface.bg",
    color: "neutral.100",
  },

  // Root styles
  ":root": {
    colorScheme: "dark !important",
  },

  // Body styles
  body: {
    zIndex: "hide",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  // Link styles
  a: {
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
  },

  // Focus styles
  "a:focus:not(:focus-visible), div:focus:not(:focus-visible), button:focus:not(:focus-visible)":
    {
      outline: "unset",
      boxShadow: "unset",
    },

  // Custom class styles
  ".blinker": {
    color: "#ED4A7D",
    fontWeight: 100,
  },

  // Slick carousel styles
  ".slick-prev:before, .slick-next:before": {
    content: '""',
  },
  ".slick-slide": {
    padding: "0 1rem",
  },
  ".slick-dots li button:before": {
    color: "#EDE8FC",
    marginTop: "10px !important",
  },
  ".slick-dots li.slick-active button:before": {
    color: "#6C4ED9 !important",
  },

  // Animation styles
  ".blink_me": {
    animation: "blinker 1s linear infinite",
  },
  "@keyframes blinker": {
    "0%": { opacity: 1 },
    "49%": { opacity: 1 },
    "50%": { opacity: 0 },
    "100%": { opacity: 0 },
  },

  // Navigation styles
  ".nav": {
    top: "0px",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "500ms",
    zIndex: "1 !important",
  },
  ".nav.down": {
    top: "-10rem",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "500ms",
  },

  // Timeframe styles
  ".timeframe": {
    bottom: "0px",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "500ms",
  },
  ".timeframe.down": {
    bottom: "-20rem",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "500ms",
  },

  // WalletConnect modal styles
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
  ".walletconnect-modal__footer": {
    overflowX: "scroll !important",
    justifyContent: "flex-start !important",
    paddingBottom: "10px !important",
  },

  // Add fadeIn animation for AvatarTooltip
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "scale(0.85)" },
    "100%": { opacity: 1, transform: "scale(1)" },
  },
}

export const styles = {
  global: globalStyles,
}
