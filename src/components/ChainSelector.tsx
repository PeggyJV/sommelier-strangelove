import React, { ReactElement } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'

interface Props extends SelectProps {
  chains: string[]
}

export const ChainSelector = ({ chains }: Props): ReactElement => {
  return (
    <Select>
      {chains.map((chain, i) => (
        <option key={i} value={chain}>
          {chain}
        </option>
      ))}
    </Select>
  )
}
