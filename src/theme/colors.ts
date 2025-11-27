import sommTheme from "./somm-theme.json"

// New primary brand colors from design tokens
const primary = {
  base: sommTheme.colors.primary,
  light: "#4A58FF",
  dark: "#1A28CC",
  extraDark: "#0D1466",
}

const secondary = {
  base: sommTheme.colors.secondary,
  light: "#8A7AEF",
  dark: "#4A3CB8",
  extraDark: "#2A2268",
}

// Legacy purple (keeping for backward compatibility)
const purple = {
  base: sommTheme.colors.secondary,
  light: "#EDE8FC",
  dark: "#332566",
  extraDark: "#1E163D",
}

const red = {
  normal: sommTheme.colors.error,
  base: sommTheme.colors.error,
  light: "#FCE5E3",
  dark: "#662521",
  extraDark: "#331210",
}

const orange = {
  base: sommTheme.colors.warning,
  light: "#FCF1E3",
  dark: "#664620",
  extraDark: "#2E200E",
}

const lime = {
  base: "#BCE051",
  light: "#F6FCE3",
  dark: "#566625",
  extraDark: "#2E200E",
}

const turquoise = {
  base: sommTheme.colors.success,
  light: "#EDFCF7",
  dark: "#20664D",
  extraDark: "#0D291F",
}

const violet = {
  base: "#ED4A7D",
  light: "#FCE8EF",
  dark: "#662035",
  extraDark: "#33101B",
}

const neutral = {
  100: "#FAFAFC",
  200: "#EDEBF5",
  300: sommTheme.colors.textSecondary,
  400: "#9E9DA3",
  500: "#605E66",
  600: "#4C4B52",
  700: sommTheme.colors.borderSubtle,
  800: sommTheme.colors.surface,
  900: sommTheme.colors.background,
}

const surface = {
  bg: sommTheme.colors.background,
  primary: sommTheme.colors.surface,
  secondary: "rgba(106, 87, 232, 0.16)",
  tertiary: "rgba(106, 87, 232, 0.24)",
  blackTransparent: "rgba(13, 15, 20, 0.8)",
  quartnerary: "rgba(106, 87, 232, 0.32)",
}

const gradient = {
  primary: `linear-gradient(${sommTheme.colors.secondary}, ${sommTheme.colors.primary})`,
  secondary: `linear-gradient(${sommTheme.colors.secondary}, #332566)`,
}

const overlay = {
  modal: "rgba(13, 15, 20, 0.64)",
}

// Brand tokens from design system
const brand = {
  primary: sommTheme.colors.primary,
  secondary: sommTheme.colors.secondary,
  background: sommTheme.colors.background,
  surface: sommTheme.colors.surface,
  textPrimary: sommTheme.colors.textPrimary,
  textSecondary: sommTheme.colors.textSecondary,
  borderSubtle: sommTheme.colors.borderSubtle,
  success: sommTheme.colors.success,
  warning: sommTheme.colors.warning,
  error: sommTheme.colors.error,
}

export const colors = {
  primary,
  secondary,
  purple,
  red,
  orange,
  lime,
  turquoise,
  violet,
  neutral,
  surface,
  gradient,
  overlay,
  brand,
}
