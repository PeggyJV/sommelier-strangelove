import sommTheme from "./somm-theme.json"

export const fonts = {
  heading: sommTheme.typography.fontFamilyPrimary,
  body: sommTheme.typography.fontFamilyPrimary,
}

export const fontWeights = {
  regular: sommTheme.typography.weights.regular,
  medium: sommTheme.typography.weights.medium,
  semibold: sommTheme.typography.weights.semibold,
}

export const fontSizes = {
  xs: sommTheme.typography.sizes.xs,
  sm: sommTheme.typography.sizes.sm,
  md: sommTheme.typography.sizes.base,
  lg: sommTheme.typography.sizes.lg,
  xl: sommTheme.typography.sizes.xl,
  "2xl": sommTheme.typography.sizes["2xl"],
  "3xl": sommTheme.typography.sizes["3xl"],
  "4xl": sommTheme.typography.sizes["4xl"],
  "5xl": sommTheme.typography.sizes["5xl"],
}
