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
    "a:focus:not(:focus-visible), div:focus:not(:focus-visible), button:focus:not(:focus-visible)":
      {
        outline: "unset",
        boxShadow: "unset",
      },
    "@media only screen and (min-width: 595px) and (max-width: 953px)":
      {
        "#caller > div:nth-last-child(2)": {
          borderColor: "transparent",
        },
      },
    "@media only screen and (max-width: 591px)": {
      "#cellarStats > div:nth-last-child(2)": {
        borderColor: "transparent",
      },
    },
  },
}
