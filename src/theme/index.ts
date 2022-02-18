import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { styles } from './styles'
import { fonts } from './fonts'

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  config,
  styles,
  fonts
})

export default theme
