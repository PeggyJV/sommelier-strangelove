import {
  Flex,
  HStack,
  Input,
  StackDivider,
  Text
} from "@chakra-ui/react"
import { ConfigProps } from "data/types"
import { bondingPeriodOptions } from "data/uiConfig"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

interface BondingPeriodOptionsProps {
  cellarConfig: ConfigProps
}

export const BondingPeriodOptions = ({
  cellarConfig,
}: BondingPeriodOptionsProps) => {
  const { register, getValues, setValue } = useFormContext()
  const bondingPeriod = getValues("bondingPeriod")

  useEffect(() => {
    const options = bondingPeriodOptions(cellarConfig)
    // Automatically set the bonding period to 14 days if applicable
    const defaultOption = options.find((option) => option.value === 1)
    if (defaultOption) {
      setValue("bondingPeriod", defaultOption.value)
    }
  }, [cellarConfig, setValue])

  return (
    <HStack
      spacing={0}
      justify="space-evenly"
      borderRadius={12}
      border="1px solid"
      borderColor="purple.dark"
      overflow="hidden"
      divider={<StackDivider borderColor="inherit" />}
    >
      {bondingPeriodOptions(cellarConfig).map(
        ({ title, amount, value }, i) => {
          return (
            <Flex
              direction="column"
              align="center"
              pos="relative"
              as="label"
              key={i}
              flex={1}
              px={3.3}
              py={2}
              _hover={{
                cursor: "pointer",
                backgroundColor:
                  value === bondingPeriod
                    ? "rgba(96, 80, 155, 0.4)"
                    : undefined,
              }}
              onClick={() => setValue("bondingPeriod", value)}
            >
              <Input
                pos="absolute"
                border="1px solid red"
                w={0}
                h={0}
                m={0}
                opacity={0}
                type="radio"
                value={value}
                checked={value === bondingPeriod}
                {...register("bondingPeriod")}
                style={{ display: "none" }}
              />
              <Text
                as="span"
                fontWeight="bold"
                fontSize="xl"
                textAlign="center"
              >
                {title}
              </Text>
              <Text as="span" fontSize="sm" textAlign="center">
                {amount}
              </Text>
            </Flex>
          )
        }
      )}
    </HStack>
  )
}
