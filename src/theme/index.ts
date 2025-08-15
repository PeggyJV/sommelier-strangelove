import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import { styles } from "./styles"
import { fonts } from "./fonts"
import { colors } from "./colors"
import { components } from "./components"
import { sizes } from "./sizes"
import { shadows } from "./shadows"

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: "light"
}

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  config,
  styles,
  fonts,
  colors,
  components,
  sizes,
  shadows,
  // Semantic tokens and text styles for consistent UI theming
  semanticTokens: {
    colors: {
      "text.primary": { default: "white" },
      "text.secondary": { default: "neutral.300" },
      "border.subtle": { default: "whiteAlpha.200" },
      // Banner-specific tokens (UI-only)
      // Preferred aliases
      "banner.bg.start": { default: "#0B0F17" },
      "banner.bg.mid": { default: "#0E1A2A" },
      "banner.bg.end": { default: "#143C50" },
      "banner.border": { default: "border.subtle" },
      // Back-compat
      "banner.gradient.start": { default: "#0B0F17" },
      "banner.gradient.end": { default: "#0B2438" },
      "banner.bloom.cyanA": { default: "rgba(0,163,255,0.12)" },
      "banner.bloom.cyanB": { default: "rgba(41,227,254,0.10)" },
      // Text
      "banner.text.h1": { default: "text.primary" },
      "banner.text.body": { default: "text.secondary" },
      // CTA (generic + banner)
      "cta.filled.bg": { default: "white" },
      "cta.filled.fg": { default: "black" },
      "cta.outline.fg": { default: "whiteAlpha.900" },
      "cta.outline.br": { default: "white" },
      "banner.cta.filled.bg": { default: "white" },
      "banner.cta.filled.fg": { default: "black" },
      "banner.cta.outline.fg": { default: "whiteAlpha.900" },
      "banner.cta.outline.br": { default: "white" },
      // Chips & pill
      "chip.bg": { default: "whiteAlpha.100" },
      "chip.fg": { default: "whiteAlpha.900" },
      "banner.pill.bg": { default: "rgba(0,163,255,0.16)" },
      "banner.pill.fg": { default: "whiteAlpha.900" },
      // Countdown boxes
      "count.box.bg": { default: "whiteAlpha.100" },
      "count.box.fg": { default: "white" },
      "count.box.sub": { default: "text.secondary" },
    },
  },
  textStyles: {
    heroTitle: { fontWeight: 800, lineHeight: 1.05 },
    bodyMd: { fontSize: ["sm", "md"], color: "text.secondary" },
  },
})

export default theme
