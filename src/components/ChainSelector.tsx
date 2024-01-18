import { ReactElement, VFC } from "react"
import { Box, Select, SelectProps, Text } from "@chakra-ui/react"
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends SelectProps {
  chains: string[],
  direction: string,
  register: UseFormRegisterReturn;
}

export const ChainSelector: VFC<Props> = ({
  chains,
  direction,
  register,
  defaultValue,
  ...rest
}): ReactElement => {
  return (
      <>
          <Text
              fontWeight="bold"
              color="neutral.400"
              fontSize="xs"
          >
              {direction}
          </Text>
          <Select
              borderRadius="16px"
              fontWeight="medium"
              borderWidth="1px"
              borderColor="neutral.600"
              defaultValue={defaultValue}
              {...register}
              {...rest}
          >
            {chains.map((chain, i) => (
                <Box as="option" color="surface.bg" key={i} value={chain}>
                  {chain}
                </Box>
            ))}
          </Select>
      </>
  )
}
