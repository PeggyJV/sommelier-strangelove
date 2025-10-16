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
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { LogoIcon } from "components/_icons"
import { CellarType, Badge } from "data/types"
import { useEffect, useState } from "react"
import { StrategyDate } from "./StrategyDate"
import React from "react"

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
  badges?: Badge[]
  isHero?: boolean
  isSommNative?: boolean
}

export const formatText = (text: string, isMobile: boolean) => {
  if (isMobile) {
    return (
      <Text color="neutral.400" width="10em">
        {text.substring(0, 25)}
        <chakra.span letterSpacing="-4px" ml={-0.5}>
          ...
        </chakra.span>
      </Text>
    )
  }
  if (text.length > 40) {
    return (
      <Text color="neutral.400" width="10em">
        {text.substring(0, 40)}
        <chakra.span letterSpacing="-4px" ml={-0.5}>
          ...
        </chakra.span>
      </Text>
    )
  }
  return (
    <Text color="neutral.400" width="9em">
      {text}
    </Text>
  )
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
  badges,
  isHero,
  isSommNative,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
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
      <Stack
        direction="row"
        alignItems="center"
        {...props}
        //border="1px solid red"
        width="100%"
        //overflow="hidden"
      >
        <Image
          boxSize="40px"
          boxShadow={
            isHero ? "0 0 15px 5px rgba(147, 51, 234, 0.3)" : "none"
          }
          src={icon}
          rounded="full"
          alt="strategy icon"
        />
        <Box>
          <Flex
            gap={1}
            alignItems="center"
            fontSize="0.75rem"
            fontWeight={600}
          >
            <Heading fontSize={isHero ? "2rem" : "1rem"}>
              {title}
            </Heading>{" "}
          </Flex>
          <Flex
            gap={1}
            alignItems="center"
            fontSize="0.75rem"
            fontWeight={600}
            paddingTop={".2em"}
          >
            <StrategyDate date={date} deprecated={isDeprecated} />
            {/* Somm-native badge first when present */}
            {isSommNative && (
              <Text
                as="span"
                aria-label="Somm-native"
                title="Somm-native"
                bg="#2ECC71"
                color="#FFFFFF"
                fontSize="11px"
                fontWeight={600}
                px="10px"
                py="4px"
                borderRadius="9999px"
                lineHeight="1"
                display="inline-flex"
                alignItems="center"
              >
                Somm-native
              </Text>
            )}
            {badges && badges.length > 0 && (
              <Wrap
                spacing="2"
                justify={isMobile ? "start" : "flex-start"}
              >
                {badges.map((badge, index) => (
                  <WrapItem key={index}>
                    <Text
                      bg={
                        badge.customStrategyHighlightColor !==
                        undefined
                          ? badge.customStrategyHighlightColor
                          : "purple.base"
                      }
                      rounded="4"
                      paddingLeft=".5em"
                      paddingRight=".5em"
                      fontSize="0.75rem"
                      fontWeight={600}
                      width="fit-content"
                      display="inline-block"
                    >
                      {badge.customStrategyHighlight}
                    </Text>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Flex>
          <Flex
            gap={1}
            alignItems="center"
            fontSize="0.75rem"
            fontWeight={600}
          >
            {provider &&
              strategyType &&
              formatText(`${provider} · ${strategyType}`, isMobile)}
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
