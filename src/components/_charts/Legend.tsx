import { HStack, Box, Text } from "@chakra-ui/react"

interface LegendProps {
  color: string
  title: string
}

export const Legend = ({ color, title }: LegendProps) => {
  return (
    <HStack>
      <Box
        borderRadius="4px"
        border="2px solid #D9D7E0"
        padding="2px"
      >
        <Box
          boxSize="8px"
          borderRadius="2px"
          backgroundColor={color}
        />
      </Box>
      <Text color="neutral.400">{title}</Text>
    </HStack>
  )
}
