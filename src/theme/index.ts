import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import { styles } from "./styles"
import { fonts, fontWeights, fontSizes } from "./fonts"
import { colors } from "./colors"
import { components } from "./components"
import { sizes } from "./sizes"
import { shadows } from "./shadows"
import sommTheme from "./somm-theme.json"

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  config,
  styles,
  fonts,
  fontWeights,
  fontSizes,
  colors,
  components,
  sizes,
  shadows,
  // Border radii from design tokens
  radii: {
    none: "0",
    sm: sommTheme.radii.sm,
    md: sommTheme.radii.md,
    lg: sommTheme.radii.lg,
    full: sommTheme.radii.full,
  },
  // Semantic tokens for consistent UI theming
  semanticTokens: {
    colors: {
      // Core brand tokens
      "brand.primary": { default: sommTheme.colors.primary },
      "brand.secondary": { default: sommTheme.colors.secondary },
      "brand.background": { default: sommTheme.colors.background },
      "brand.surface": { default: sommTheme.colors.surface },
      // Text tokens
      "text.primary": { default: sommTheme.colors.textPrimary },
      "text.secondary": { default: sommTheme.colors.textSecondary },
      // Border tokens
      "border.subtle": { default: sommTheme.colors.borderSubtle },
      // State tokens
      "state.success": { default: sommTheme.colors.success },
      "state.warning": { default: sommTheme.colors.warning },
      "state.error": { default: sommTheme.colors.error },
      // Banner-specific tokens (UI-only)
      "banner.bg.start": { default: sommTheme.colors.secondary },
      "banner.bg.mid": { default: sommTheme.colors.primary },
      "banner.bg.end": { default: "#00A3FF" },
      "banner.border": { default: "border.subtle" },
      // Back-compat
      "banner.gradient.start": {
        default: sommTheme.colors.background,
      },
      "banner.gradient.end": { default: "#0B2438" },
      "banner.bloom.cyanA": { default: "rgba(0,163,255,0.12)" },
      "banner.bloom.cyanB": { default: "rgba(41,227,254,0.10)" },
      // Lido accent
      "banner.lido.info": { default: "#00A3FF" },
      // Text
      "banner.text.h1": { default: "text.primary" },
      "banner.text.body": { default: "text.secondary" },
      // CTA (generic + banner)
      "cta.filled.bg": { default: sommTheme.colors.primary },
      "cta.filled.fg": { default: sommTheme.colors.textPrimary },
      "cta.outline.fg": { default: "whiteAlpha.900" },
      "cta.outline.br": { default: sommTheme.colors.textPrimary },
      "banner.cta.filled.bg": {
        default: sommTheme.colors.textPrimary,
      },
      "banner.cta.filled.fg": {
        default: sommTheme.colors.background,
      },
      "banner.cta.outline.fg": { default: "whiteAlpha.900" },
      "banner.cta.outline.br": {
        default: sommTheme.colors.textPrimary,
      },
      // Chips & pill
      "chip.bg": { default: "whiteAlpha.100" },
      "chip.fg": { default: "whiteAlpha.900" },
      "banner.pill.bg": { default: "rgba(36, 52, 255, 0.16)" },
      "banner.pill.fg": { default: "text.primary" },
      // Countdown boxes
      "count.box.bg": { default: "whiteAlpha.100" },
      "count.box.border": {
        default: `${sommTheme.colors.secondary}73`,
      },
      "count.box.fg": { default: sommTheme.colors.textPrimary },
      "count.box.sub": { default: "text.secondary" },
    },
  },
  textStyles: {
    heroTitle: {
      fontWeight: sommTheme.typography.weights.semibold,
      lineHeight: 1.05,
    },
    bodyMd: {
      fontSize: ["sm", "md"],
      color: "text.secondary",
    },
  },
})

export default theme
