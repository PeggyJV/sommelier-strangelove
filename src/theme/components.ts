import { ThemeComponents } from '@chakra-ui/react'
export const components: ThemeComponents = {
  Button: {
    baseStyle: {
      borderRadius: 25,
      color: 'white'
    },
    variants: {
      outline: {
        color: 'white',
        borderColor: 'electricIndigo.400',
        _hover: {
          color: 'electricIndigo.900'
        },
        _active: {
          color: 'white'
        },
        _disabled: {
          color: 'white'
        },
        _loading: {
          color: 'white'
        }
      }
    },
    defaultProps: {
      colorScheme: 'electricIndigo',
      variant: 'outline'
    }
  },
  Select: {
    baseStyle: {
      borderRadius: 25,
      border: '1px solid'
    },
    variants: {
      outline: {
        color: 'white',
        borderColor: 'electricIndigo.400'
      }
    },
    defaultProps: {
      variant: 'outline'
    }
  }
}
