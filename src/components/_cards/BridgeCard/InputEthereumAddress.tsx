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
import { BridgeFormValues } from "."

export const InputEthereumAddress: React.FC<InputProps> = ({
  children,
  ...rest
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getValues, getFieldState } =
    useFormContext<BridgeFormValues>()
  const isError = !!getFieldState("address").error
  const [isActive, setActive] = useState(false)
  const { address, isConnected } = useAccount()

  const onAutofillClick = async (isValidateAddress?: boolean) => {
    try {
      if (!address) throw new Error("Address not defined")
      setValue(
        "address",
        isValidateAddress ? getValues().address : address,
        {
          shouldValidate: true,
        }
      )
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
        {isConnected && (
          <HStack
            as="button"
            spacing={1}
            onClick={() => onAutofillClick()}
          >
            <Text fontWeight="bold" color="white" fontSize="xs">
              Import from Wallet
            </Text>
            <MoneyWalletIcon boxSize="10px" />
          </HStack>
        )}
      </HStack>
      <Box
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={
          isError
            ? "redOutline1"
            : isActive
            ? "purpleOutline1"
            : "none"
        }
        borderRadius="16px"
      >
        <Input
          id="address"
          placeholder="Enter Ethereum address"
          fontSize="xs"
          fontWeight={700}
          backgroundColor="surface.tertiary"
          variant="unstyled"
          borderRadius="16px"
          px={4}
          py={6}
          maxH="64px"
          _placeholder={{
            fontSize: "lg",
          }}
          type="text"
          {...register("address", {
            required: "Enter Ethereum address",
            validate: {
              validAddress: (v) =>
                isAddress(v) || "Address is not valid",
            },
          })}
          autoComplete="off"
          autoCorrect="off"
          {...rest}
        />
      </Box>
      <FormErrorMessage>
        <HStack spacing="6px">
          <InformationIcon color="red.base" boxSize="12px" />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            Address is not valid—make sure your Ethereum address
          </Text>
        </HStack>
      </FormErrorMessage>
    </Stack>
  )
}
