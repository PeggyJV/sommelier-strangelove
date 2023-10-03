import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  StackProps,
  Text,
  Tooltip,
  chakra,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { CellarType } from "data/types"
import React from "react"
import { StrategyDate } from "./StrategyDate"

interface StrategySectionProps extends StackProps {
  icon: string
  title: string
  description: string
  provider?: string
  type?: number
  date?: string
  netValue?: string
  rewards?: string
  isDeprecated?: boolean
  customStrategyHighlight?: string
}

export const formatText = (text: string) => {
  if (text.length > 19) {
    return (
      <Text color="neutral.400">
        {text.substring(0, 19)}
        <chakra.span letterSpacing="-4px" ml={-0.5}>
          ...
        </chakra.span>
      </Text>
    )
  }
  return <Text color="neutral.400">{text}</Text>
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
  isDeprecated,
  customStrategyHighlight,
  ...props
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
      <Stack direction="row" alignItems="center" {...props}>
        <Image
          boxSize="40px"
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
            {customStrategyHighlight !== undefined ? (
              <Text
                bg="purple.base"
                rounded="4"
                paddingLeft={".5em"}
                paddingRight={".5em"}
              >
                {customStrategyHighlight}
              </Text>
            ) : null}
            <StrategyDate date={date} deprecated={isDeprecated} />
            {provider &&
              strategyType &&
              formatText(`${provider} · ${strategyType}`)}
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
