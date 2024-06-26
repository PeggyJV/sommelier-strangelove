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
})

export default theme
