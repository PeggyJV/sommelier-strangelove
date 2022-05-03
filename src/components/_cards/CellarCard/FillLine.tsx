import { Box, BoxProps } from "@chakra-ui/react"

interface Props extends BoxProps {
  percentage?: number
}

export const FillLine: React.FC<Props> = ({
  percentage,
  ...rest
}) => {
  const width = `${percentage}%`
  return (
    <Box
      height="4px"
      backgroundColor="neutral.800"
      borderRadius="4px"
      alignItems="center"
      display="flex"
      {...rest}
    >
      <Box
        height="2px"
        backgroundColor="lime.base"
        width={width}
        borderRadius="2px"
        ml="1px"
      />
    </Box>
  )
}
