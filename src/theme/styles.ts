import sommTheme from "./somm-theme.json"

export const styles = {
  global: {
    MozSelection: { background: "brand.primary" },
    WebKitSelection: { background: "brand.primary" },
    "::selection": { background: "brand.primary" },
    "html, body": {
      bgColor: "brand.background",
      color: "text.primary",
      overflowX: "hidden",
    },
    ":root": {
      colorScheme: "dark !important",
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
      color: sommTheme.colors.error,
      fontWeight: 100,
    },
    ".slick-prev:before, .slick-next:before": {
      content: '""',
    },
    ".slick-slide": {
      padding: "0 1rem",
    },
    ".slick-dots li button:before": {
      color: sommTheme.colors.textSecondary,
      marginTop: "10px !important",
    },
    ".slick-dots li.slick-active button:before": {
      color: `${sommTheme.colors.primary} !important`,
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
      zIndex: "1000 !important",
    },
    ".nav.down": {
      top: "-10rem",
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "500ms",
    },
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
    ".walletconnect-modal__base": {
      background: `${sommTheme.colors.background} !important`,
      border: `1px solid ${sommTheme.colors.primary} !important`,
      borderRadius: "24px !important",
    },
    ".walletconnect-modal__mobile__toggle": {
      background: `${sommTheme.colors.surface} !important`,
      borderRadius: "20px !important",
    },
    ".walletconnect-modal__mobile__toggle_selector": {
      background: `${sommTheme.colors.surface} !important`,
      border: `1px solid ${sommTheme.colors.primary} !important`,
      borderRadius: "16px !important",
    },
    ".walletconnect-qrcode__text": {
      color: `${sommTheme.colors.textPrimary} !important`,
    },
    ".walletconnect-connect__button__text": {
      color: `${sommTheme.colors.textPrimary} !important`,
    },
    ".walletconnect-search__input": {
      background: `${sommTheme.colors.surface} !important`,
    },
    ".walletconnect-modal__footer": {
      overflowX: "scroll !important",
      justifyContent: "flex-start !important",
      paddingBottom: "10px !important",
    },
  },
}
