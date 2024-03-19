import {
  Stack,
  Input,
  Text,
  HStack,
  InputProps,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react"
import { InformationIcon, MoneyWalletIcon } from "components/_icons"
import { isAddress } from "ethers/lib/utils"
import { useBrandedToast } from "hooks/chakra"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"
import { SnapshotFormValues } from "."

export const InputEthereumAddress: React.FC<InputProps> = ({
  ...rest
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getValues, getFieldState } =
    useFormContext<SnapshotFormValues>()
  const isError = !!getFieldState("eth_address").error
  const [isActive, setActive] = useState(false)
  const { address, isConnected } = useAccount()

  const onAutofillClick = async () => {
    try {
      if (!address) throw new Error("No wallet connected")
      setValue("eth_address", address, {
        shouldValidate: true,
      })
    } catch (e) {
      const error = e as Error
      addToast({
        heading: "Import from Wallet",
        body: <Text>{error.message}</Text>,
        status: "error",
        closeHandler: closeAll,
      })
    }
  }

  return (
    <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          Ethereum Address
        </Text>
        <HStack
          as="button"
          type="button"
          spacing={1}
          onClick={onAutofillClick}
        >
          <Text fontWeight="bold" color="white" fontSize="xs">
            Import ETH address
          </Text>
          <MoneyWalletIcon boxSize="10px" />
        </HStack>
      </HStack>
      <Box
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={isError ? "redOutline1" : "purpleOutline1"}
        borderRadius="16px"
      >
        <Input
          id="eth_address"
          placeholder="Ethereum address"
          fontSize="xs"
          fontWeight={700}
          backgroundColor="surface.tertiary"
          variant="unstyled"
          borderRadius="16px"
          px={4}
          py={6}
          maxH="64px"
          type="text"
          {...register("eth_address", {
            required: "Ethereum address is required",
            validate: (value) =>
              isAddress(value) ||
              "This is not a valid Ethereum address",
          })}
          autoComplete="off"
          autoCorrect="off"
          {...rest}
        />
      </Box>
      {isError && (
        <FormErrorMessage>
          <HStack spacing="6px">
            <InformationIcon color="red.base" boxSize="12px" />
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="red.light"
            >
              Ethereum address is not valid—make sure it is correct.
            </Text>
          </HStack>
        </FormErrorMessage>
      )}
    </Stack>
  )
}
