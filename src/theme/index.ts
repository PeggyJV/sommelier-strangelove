import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { styles } from './styles'

// https://chakra-ui.com/docs/theming/theme#config
export const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  config,
  styles
})

export default theme
