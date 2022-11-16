import { HStack, Box, Text, Button } from "@chakra-ui/react"

interface LegendProps {
  color: string
  title: string
  active?: boolean
  onClick?: () => void
}

export const Legend = ({
  color,
  title,
  active,
  onClick,
}: LegendProps) => {
  return (
    <Button variant="unstyled" onClick={onClick}>
      <HStack>
        <Box
          borderRadius="4px"
          border="2px solid #D9D7E0"
          padding="2px"
        >
          <Box
            boxSize="8px"
            borderRadius="2px"
            backgroundColor={active ? color : "transparent"}
          />
        </Box>
        <Text color="neutral.400">{title}</Text>
      </HStack>
    </Button>
  )
}
