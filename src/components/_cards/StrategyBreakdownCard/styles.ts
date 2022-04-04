import { TabPanelProps, TabProps } from '@chakra-ui/react'

export const tabProps: TabProps = {
  color: 'text.body.lightMuted',
  fontWeight: 'bold',
  _selected: {
    color: 'white',
    position: 'relative',
    _after: {
      content: '""',
      position: 'absolute',
      bottom: -0.5,
      left: 0,
      height: '4px',
      width: '100%',
      bg: 'sunsetOrange',
      borderRadius: '2px'
    }
  }
}

export const tabPanelProps: TabPanelProps = {
  px: 0
}
