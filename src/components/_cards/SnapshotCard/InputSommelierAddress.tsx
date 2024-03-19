import {
  Stack,
  Input,
  Text,
  HStack,
  InputProps,
  FormErrorMessage,
  Image,
  Box,
} from "@chakra-ui/react"
import { Link } from "components/Link"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { getKeplr, mainnetChains, useAccount } from "graz"
import { useBrandedToast } from "hooks/chakra"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { validateSommelierAddress } from "utils/validateSommelierAddress"
import { SnapshotFormValues } from "."

export const InputSommelierAddress: React.FC<InputProps> = ({
  ...rest
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getValues, getFieldState } =
    useFormContext<SnapshotFormValues>()
  const isError = !!getFieldState("somm_address").error
  const [isActive, setActive] = useState(false)
  const { isConnected } = useAccount()

  const onAutofillClick = async () => {
    try {
      const keplr = await getKeplr()
      if (!keplr) throw new Error("Keplr extension not found")
      const key = await keplr.getKey(mainnetChains.sommelier.chainId)
      if (!key.bech32Address) throw new Error("Address not defined")
      setValue("somm_address", key.bech32Address, {
        shouldValidate: true,
      })
    } catch (e) {
      const error = e as Error
      addToast({
        heading: "Import from Keplr",
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
          Sommelier Address
        </Text>
        <HStack
          as="button"
          type="button"
          spacing={1}
          onClick={onAutofillClick}
        >
          <Text fontWeight="bold" color="white" fontSize="xs">
            Import SOMM address
          </Text>
          <Image
            src="/assets/images/keplr.png"
            alt="Keplr logo"
            boxSize="4"
          />
        </HStack>
      </HStack>
      <Box
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={isError ? "redOutline1" : "purpleOutline1"}
        borderRadius="16px"
      >
        <Input
          id="somm_address"
          placeholder="Sommelier address"
          fontSize="xs"
          fontWeight={700}
          backgroundColor="surface.tertiary"
          variant="unstyled"
          borderRadius="16px"
          px={4}
          py={6}
          maxH="64px"
          type="text"
          {...register("somm_address", {
            required: "Sommelier address is required",
            validate: (value) =>
              validateSommelierAddress(value) ||
              "This is not a valid Sommelier address",
          })}
          {...rest}
          type="text"
          {...register("somm_address", {
            required: "Enter Sommelier address",
            validate: {
              validAddress: (v) =>
                validateSommelierAddress(v) || "Address is not valid",
            },
          })}
          autoComplete="off"
          autoCorrect="off"
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
              Sommelier address is not valid—make sure it's from a
              Cosmos wallet.
            </Text>
          </HStack>
        </FormErrorMessage>
      )}
    </Stack>
  )
}
