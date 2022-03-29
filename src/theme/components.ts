import { ThemeComponents } from '@chakra-ui/react'

export const components: ThemeComponents = {
  Button: {
    baseStyle: {
      borderRadius: 25,
      color: 'text.body.dark',
      bgColor: 'energyYellow'
    },
    defaultProps: {
      colorScheme: 'electricIndigo',
    }
  },
  Heading: {
    baseStyle: {
      color: 'text.headlines.light'
    }
  }
}
