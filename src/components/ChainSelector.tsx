import React, { ReactElement, VFC } from 'react'
import { Select, SelectProps } from '@chakra-ui/react'

interface Props extends SelectProps {
  chains: string[]
}

export const ChainSelector: VFC<Props> = ({
  chains,
  ...rest
}): ReactElement => {
  return (
    <Select bg='gray.100' color='black' fontWeight='medium' {...rest}>
      {chains.map((chain, i) => (
        <option key={i} value={chain}>
          {chain}
        </option>
      ))}
    </Select>
  )
}
