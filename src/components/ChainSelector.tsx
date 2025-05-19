import { ReactElement, FC } from "react"
import { Box, Select, SelectProps } from "@chakra-ui/react"

interface Props extends SelectProps {
  chains: string[]
}

export const ChainSelector: FC<Props> = ({
  chains,
  ...rest
}): ReactElement<any> => {
  return (
    <Select borderRadius={25} fontWeight="medium" {...rest}>
      {chains.map((chain, i) => (
        <Box as="option" color="surface.bg" key={i} value={chain}>
          {chain}
        </Box>
      ))}
    </Select>
  )
}
