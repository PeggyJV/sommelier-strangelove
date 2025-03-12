import { createSystem, defaultConfig } from "@chakra-ui/react"
import { globalStyles } from "./styles"
import { fonts } from "./fonts"
import { colors } from "./colors"
import { components } from "./components"
import { sizes } from "./sizes"
import { shadows } from "./shadows"

// https://chakra-ui.com/docs/theming/theme#config
export const config = {
  initialColorMode: "light",
}

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors,
      fonts,
      shadows,
      sizes,
    },
    recipes: components,
  },
  globalCss: globalStyles,
  preflight: true,
})

export default system
