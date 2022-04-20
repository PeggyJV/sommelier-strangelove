import { Box, BoxProps } from '@chakra-ui/react'
import { VFC } from 'react'
import { useToken } from 'wagmi'

interface TokenProps extends BoxProps {
  address?: string
}

export const TokenOption: VFC<TokenProps> = ({ address, ...rest }) => {
  const [{ data, error, loading }, getToken] = useToken({
    address
  })
  const { symbol } = data || {}

  return (
    <Box as='option' value={address} {...rest}>
      {loading ? 'loading' : symbol}
    </Box>
  )
}
