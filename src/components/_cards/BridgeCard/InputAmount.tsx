import {
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react"
import React, { useState } from "react"

import Image from "next/image"
import { useAccount, useBalance } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { useFormContext } from "react-hook-form"
import { BridgeFormValues } from "."
import { InformationIcon } from "components/_icons"
import { config } from "utils/config"

export const InputAmount: React.FC = () => {
  const { register, setValue, formState, getFieldState } =
    useFormContext<BridgeFormValues>()

  const isError = !!getFieldState("amount").error
  const [isActive, setActive] = useState(false)
  const { address, isConnecting } = useAccount()
  const { data, error, isLoading } = useBalance({
    addressOrName: address,
    token: config.CONTRACT.SOMMELLIER.ADDRESS,
    watch: true,
  })

  const isBalanceLoading = isConnecting || isLoading

  const onMaxButtonClick = () => {
    if (!data) return
    const amount = parseFloat(
      toEther(data.value, data.decimals, false)
    )
    setValue("amount", amount, { shouldValidate: true })
  }

  return (
    <Stack spacing={2}>
      <Text fontWeight="bold" color="neutral.400" fontSize="xs">
        Enter Amount
      </Text>
      <HStack
        backgroundColor="surface.tertiary"
        justifyContent="space-between"
        borderRadius={16}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={
          isError
            ? "redOutline1"
            : isActive
            ? "purpleOutline1"
            : "none"
        }
        px={4}
        py={3}
        height="64px"
      >
        <HStack>
          <Image
            width="16px"
            height="16px"
            src="/assets/images/coin.png"
            alt="coin logo big"
          />
          <Text fontWeight="semibold">SOMM</Text>
        </HStack>
        <VStack spacing={0} align="flex-end">
          <Input
            id="amount"
            variant="unstyled"
            pr="2"
            type="number"
            step="any"
            defaultValue="0.00"
            placeholder="0.00"
            fontSize="lg"
            fontWeight={700}
            textAlign="right"
            {...register("amount", {
              required: "Enter amount",
              valueAsNumber: true,
              validate: {
                positive: (v) =>
                  v > 0 || "You must submit a positive amount.",
                balance: (v) =>
                  (data &&
                    v <=
                      parseFloat(
                        toEther(data.value, data.decimals, false)
                      )) ||
                  "Insufficient balance",
              },
            })}
          />
          <HStack spacing={0} fontSize="10px">
            {isBalanceLoading ? (
              <Spinner size="xs" mr="2" />
            ) : (
              <>
                <Text as="span">
                  Available:{" "}
                  {(data && toEther(data.value, data.decimals)) ||
                    "--"}
                </Text>
                <Button
                  variant="unstyled"
                  p={0}
                  w="max-content"
                  h="max-content"
                  textTransform="uppercase"
                  fontSize="inherit"
                  fontWeight={600}
                  onClick={onMaxButtonClick}
                >
                  max
                </Button>
              </>
            )}
          </HStack>
        </VStack>
      </HStack>
      {formState.errors.amount && (
        <HStack spacing="6px">
          <InformationIcon color="red.base" boxSize="12px" />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {formState.errors.amount.message}
          </Text>
        </HStack>
      )}
      {error && (
        <HStack spacing="6px">
          <InformationIcon color="red.base" boxSize="12px" />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {error.message}
          </Text>
        </HStack>
      )}
    </Stack>
  )
}
