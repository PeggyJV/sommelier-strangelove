import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import { styles } from "./styles"
import { fonts } from "./fonts"
import { colors } from "./colors"
import { components } from "./components"
import { sizes } from "./sizes"
import { shadows } from "./shadows"

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: "light",
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
      // Preferred aliases mapped to brand gradient (Somm → Lido)
      "banner.bg.start": { default: "purple.dark" },
      "banner.bg.mid": { default: "purple.base" },
      "banner.bg.end": { default: "#00A3FF" },
      "banner.border": { default: "border.subtle" },
      // Back-compat
      "banner.gradient.start": { default: "#0B0F17" },
      "banner.gradient.end": { default: "#0B2438" },
      "banner.bloom.cyanA": { default: "rgba(0,163,255,0.12)" },
      "banner.bloom.cyanB": { default: "rgba(41,227,254,0.10)" },
      // Lido accent
      "banner.lido.info": { default: "#00A3FF" },
      // Text
      "banner.text.h1": { default: "text.primary" },
      "banner.text.body": { default: "text.secondary" },
      // CTA (generic + banner)
      "cta.filled.bg": { default: "purple.base" },
      "cta.filled.fg": { default: "white" },
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
      "banner.pill.fg": { default: "text.primary" },
      // Countdown boxes
      "count.box.bg": { default: "whiteAlpha.100" },
      "count.box.border": { default: "rgba(108,78,217,0.45)" },
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
