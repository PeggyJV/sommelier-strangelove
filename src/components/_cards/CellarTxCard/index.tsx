import { BoxProps } from '@chakra-ui/react'
import { VFC } from 'react'
import { ConnectedCard } from './ConnectedCard'
import { UnconnectedCard } from './UnconnectedCard'

interface Props extends BoxProps {
  isConnected: boolean
}

export const CellarTxCard: VFC<Props> = ({ isConnected }) => {
  return isConnected ? <ConnectedCard /> : <UnconnectedCard />
}
