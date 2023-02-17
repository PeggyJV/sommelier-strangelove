import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react"
import React from "react"

type StrategySectionProps = {
  icon: string
  title: string
  provider: string
  type: number
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  icon,
  title,
  provider,
  type,
}) => {
  const strategyType = type === 0 ? "Yield" : "Portfolio"
  return (
    <Stack direction="row" alignItems="center">
      <Image
        boxSize="45px"
        src={icon}
        rounded="full"
        alt="strategy icon"
      />
      <Box>
        <Heading fontSize="1rem">{title}</Heading>
        <Flex
          gap={1}
          alignItems="center"
          fontSize="0.75rem"
          fontWeight={600}
        >
          <Text bg="rgba(78, 56, 156, 0.32)" px={1.5} rounded="4">
            In 3 days
          </Text>
          <Text color="neutral.400">
            {provider}.{strategyType}
          </Text>
        </Flex>
      </Box>
    </Stack>
  )
}
