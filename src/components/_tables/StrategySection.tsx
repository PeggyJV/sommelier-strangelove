import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { CellarType } from "data/types"
import React from "react"
import { StrategyDate } from "./StrategyDate"

type StrategySectionProps = {
  icon: string
  title: string
  description: string
  provider?: string
  type?: number
  date?: string
  netValue?: string
  rewards?: string
}

export const StrategySection: React.FC<StrategySectionProps> = ({
  icon,
  title,
  provider,
  type,
  description,
  date,
  netValue,
  rewards,
}) => {
  const strategyType =
    type === CellarType.yieldStrategies ? "Yield" : "Portfolio"
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
            {date && <StrategyDate date={date} />}
            {provider && strategyType && (
              <Text color="neutral.400">
                {provider}.{strategyType}
              </Text>
            )}
            {netValue && (
              <Text
                color="neutral.400"
                fontSize="16px"
                fontWeight={500}
              >
                {netValue}
              </Text>
            )}
            {rewards && rewards !== "0.00" && (
              <HStack spacing={1} ml={2}>
                <LogoIcon
                  mx="auto"
                  color="red.normal"
                  p={0}
                  boxSize="9px"
                />
                <Text color="neutral.400" fontSize="12px">
                  {rewards}
                </Text>
              </HStack>
            )}
          </Flex>
        </Box>
      </Stack>
    </Tooltip>
  )
}
