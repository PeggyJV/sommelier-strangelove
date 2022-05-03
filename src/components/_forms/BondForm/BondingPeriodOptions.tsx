import {
  Box,
  Flex,
  HStack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import { VFC } from "react"
import { useFormContext } from "react-hook-form"

interface BondingPeriod {
  title: string
  amount: string
  value: BondingValueOptions
  checked?: boolean
}

type BondingValueOptions = 1.1 | 1.25 | 1.5

export const bondingPeriodOptions: BondingPeriod[] = [
  {
    title: "7 Days",
    amount: "1.1x SOMM",
    value: 1.1,
  },
  {
    title: "14 Days",
    amount: "1.25x SOMM",
    value: 1.25,
  },
  {
    title: "21 Days",
    amount: "1.5x SOMM",
    value: 1.5,
  },
]

export const BondingPeriodOptions: VFC = () => {
  const { register } = useFormContext()

  return (
    <HStack
      spacing={0}
      justify="space-evenly"
      border="1px solid"
      borderRadius={12}
      borderColor="neutral.400"
      overflow="hidden"
      divider={<StackDivider borderColor="inherit" />}
    >
      {bondingPeriodOptions.map(({ title, amount, value }, i) => {
        return (
          <Flex
            direction="column"
            align="center"
            pos="relative"
            as="label"
            key={i}
            flex={1}
            px={4}
            py={2}
          >
            <Box
              pos="absolute"
              as="input"
              w={0}
              h={0}
              m={0}
              opacity={0}
              type="radio"
              value={value}
              css={{
                "&:checked + div": {
                  backgroundColor: "rgba(96, 80, 155, 0.4)",
                },
              }}
              {...register("bondingPeriod")}
            />
            <Box
              pos="absolute"
              top="-0.5rem"
              w="100%"
              h="calc(100% + 1rem)"
              zIndex="hide"
            />
            <Text as="span" fontWeight="bold" pb={1}>
              {title}
            </Text>
            <Text as="span" fontSize="sm">
              {amount}
            </Text>
          </Flex>
        )
      })}
    </HStack>
  )
}
