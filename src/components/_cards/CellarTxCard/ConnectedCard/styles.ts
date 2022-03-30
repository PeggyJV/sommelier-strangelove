import {
  BoxProps,
  ButtonProps,
  TabPanelProps,
  TabProps
} from '@chakra-ui/react'

export const tabProps: TabProps = {
  pb: 4,
  borderColor: 'uiChrome.dataBorder',
  _selected: {
    color: 'white',
    borderColor: 'sunsetOrange'
  }
}

export const tabPanelProps: TabPanelProps = {
  px: 0
}

export const cardProps: BoxProps = {
  p: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bg: 'backgrounds.black'
}

export const disabledButtonProps: ButtonProps = {
  variant: 'solid',
  _disabled: {
    color: 'text.body.light',
    bg: 'text.body.darkMuted',
    cursor: 'not-allowed',
    _hover: {
      color: 'text.body.light',
      bg: 'text.body.darkMuted'
    }
  }
}
