import React, { ReactElement } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'

interface Props extends SelectProps {
  chains: string[]
}

export const ChainSelector = ({ chains }: Props): ReactElement => {
  return (
    <Select bg='gray.100' color='black' fontWeight='medium'>
      {chains.map((chain, i) => (
        <option key={i} value={chain}>
          {chain}
        </option>
      ))}
    </Select>
  )
}
