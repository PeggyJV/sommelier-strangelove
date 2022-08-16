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
import React, { useEffect } from "react"

import Image from "next/image"
import { useAccount, useBalance } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { useFormContext } from "react-hook-form"
import { AiOutlineInfo } from "react-icons/ai"

export const InputAmount: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    getFieldState,
    formState,
  } = useFormContext()

  const [account] = useAccount()
  const [{ data, error, loading }] = useBalance({
    addressOrName: account.data?.address,
    token: "0xa670d7237398238DE01267472C6f13e5B8010FD1",
    watch: true,
  })

  const watchAmount = watch("amount")

  const isBalanceLoading = account.loading || loading
  const isBalanceNotEnough =
    data &&
    watchAmount >
      parseFloat(toEther(data.value, data.decimals, false))
  const isBalanceError = error || isBalanceNotEnough

  const onMaxButtonClick = () => {
    if (!data) return
    const amount = parseFloat(
      toEther(data.value, data.decimals, false)
    )
    setValue("amount", amount)
  }

  useEffect(() => {
    if (error) {
      setError("amount", {
        message: error.message,
      })
    } else if (isBalanceNotEnough) {
      setError("amount", {
        message: "Your balance is not enough",
      })
    } else if (isNaN(watchAmount) || watchAmount < 0) {
      setError("amount", {
        message: "Invalid amount",
      })
    } else {
      clearErrors("amount")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAmount, isBalanceError])

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
    </Stack>
  )
}
