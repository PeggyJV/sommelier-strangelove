import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import React from "react"
import { StrategyDate } from "./StrategyDate"

type StrategySectionProps = {
  icon: string
  title: string
  provider: string
  type: number
  description: string
  date?: string
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  icon,
  title,
  provider,
  type,
  description,
  date,
}) => {
  const strategyType = type === 0 ? "Yield" : "Portfolio"
  return (
    <Tooltip
      label={description}
      color="neutral.100"
      border="0"
      fontSize="12px"
      bg="neutral.900"
      py="4"
      px="6"
      boxShadow="xl"
      shouldWrapChildren
    >
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
    </Tooltip>
  )
}
