import {
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  InputProps,
  Spinner,
} from "@chakra-ui/react"
import React from "react"

import Image from "next/image"
import { useAccount, useBalance } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { ErrorIcon } from "components/_icons"

interface InputAmountProps extends InputProps {
  address?: string
}

export const InputAmount: React.FC<InputAmountProps> = ({
  children,
  address,
  ...rest
}) => {
  const [account] = useAccount()
  const [{ data, error, loading }] = useBalance({
    addressOrName: account.data?.address,
    token: "0xa670d7237398238DE01267472C6f13e5B8010FD1",
    watch: true,
  })
  const isBalanceLoading = account.loading || loading

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
            {...rest}
          />
          <HStack spacing={0} fontSize="10px">
            <Text as="span">
              Available:{" "}
              {isBalanceLoading ? (
                <Spinner size="xs" />
              ) : (
                (data && toEther(data.value, data.decimals)) || "--"
              )}
            </Text>
            <Button
              variant="unstyled"
              p={0}
              w="max-content"
              h="max-content"
              textTransform="uppercase"
              fontSize="inherit"
              fontWeight={600}
            >
              max
            </Button>
          </HStack>
        </VStack>
      </HStack>
      {error && (
        <HStack color="red.base">
          <ErrorIcon boxSize={4} />
          <Text>{error.message}</Text>
        </HStack>
      )}
    </Stack>
  )
}
