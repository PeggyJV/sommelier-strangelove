import { extendTheme, ThemeConfig } from '@chakra-ui/react'

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  config
})

export default theme
