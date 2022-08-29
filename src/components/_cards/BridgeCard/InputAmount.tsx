import {
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  Spinner,
  Icon,
} from "@chakra-ui/react"
import React from "react"

import Image from "next/image"
import { useAccount, useBalance } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { useFormContext } from "react-hook-form"
import { AiOutlineInfo } from "react-icons/ai"
import { BridgeFormValues } from "."

export const InputAmount: React.FC = () => {
  const { register, setValue, formState } =
    useFormContext<BridgeFormValues>()

  const [account] = useAccount()
  const [{ data, error, loading }] = useBalance({
    addressOrName: account.data?.address,
    token: "0xa670d7237398238DE01267472C6f13e5B8010FD1",
    watch: true,
  })

  const isBalanceLoading = account.loading || loading

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
        boxShadow="purpleOutline1"
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
        <HStack>
          <Icon
            p={0.5}
            mr={1}
            color="surface.bg"
            bg="red.base"
            borderRadius="50%"
            as={AiOutlineInfo}
          />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {formState.errors.amount.message}
          </Text>
        </HStack>
      )}
      {error && (
        <HStack>
          <Icon
            p={0.5}
            mr={1}
            color="surface.bg"
            bg="red.base"
            borderRadius="50%"
            as={AiOutlineInfo}
          />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {error.message}
          </Text>
        </HStack>
      )}
    </Stack>
  )
}
