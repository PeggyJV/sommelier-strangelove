import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { StrategyDate } from "./StrategyDate"

type StrategySectionProps = {
  icon: string
  title: string
  provider: string
  type: number
  date?: string
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  icon,
  title,
  provider,
  type,
  date,
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
          <StrategyDate date={date} />
          <Text color="neutral.400">
            {provider}.{strategyType}
          </Text>
        </Flex>
      </Box>
    </Stack>
  )
}
