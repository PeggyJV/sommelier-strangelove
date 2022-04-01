import { Styles } from '@chakra-ui/theme-tools'

export const styles: Styles = {
  global: {
    'html, body': {
      bgColor: 'backgrounds.offBlack',
      // bgImage: 'url("/assets/top-left-bg.png")',
      bgRepeat: 'no-repeat',
      color: 'text.body.light'
    },
    body: {
      zIndex: 'hide'
    }
  }
}
