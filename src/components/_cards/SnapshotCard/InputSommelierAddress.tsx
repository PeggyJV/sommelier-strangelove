import React, { useState, FC } from "react"
import {
  Stack,
  Input,
  Text,
  HStack,
  FormErrorMessage,
  Image,
  Box,
  InputProps,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { Link } from "components/Link"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { getKeplr, useAccount } from "graz"
import { SOMMELIER_CHAIN_ID } from "utils/grazChains"
import { validateSommelierAddress } from "utils/validateSommelierAddress"
import { useBrandedToast } from "hooks/chakra"
interface InputSommelierAddressProps extends InputProps {
  disabled?: boolean
}

export const InputSommelierAddress: FC<
  InputSommelierAddressProps
> = ({ disabled, ...rest }) => {
  const { addToast, closeAll: _closeAll } = useBrandedToast()
  const { register, setValue, getFieldState } = useFormContext()
  const isError = !!getFieldState("somm_address").error
  const [_isActive, setActive] = useState(false)
  const { isConnected: _isConnected } = useAccount()

  const onAutofillClick = async () => {
    try {
      const keplr = await getKeplr()
      if (!keplr) throw new Error("Keplr extension not found")
      const key = await keplr.getKey(SOMMELIER_CHAIN_ID)
      if (!key.bech32Address) throw new Error("Address not defined")
      setValue("somm_address", key.bech32Address, {
        shouldValidate: true,
      })
    } catch (_e) {
      addToast({
        heading: "Keplr not found",
        status: "error",
        body: (
          <Text>
            {" "}
            <>
              <Link
                display="flex"
                alignItems="center"
                href="https://www.keplr.app/download"
                isExternal
              >
                <Text as="span">Please install Keplr extension</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
            </>
          </Text>
        ),
        closeHandler: close,
        duration: null,
      })
    }
  }

  return (
    <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          Somm Address
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
          placeholder="Somm address"
          fontSize="xs"
          fontWeight={700}
          backgroundColor="surface.tertiary"
          variant="unstyled"
          borderRadius="16px"
          px={4}
          py={6}
          maxH="64px"
          isDisabled={disabled}
          {...register("somm_address", {
            required: "Somm address is required",
            validate: validateSommelierAddress,
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
              Somm address is not valid—make sure it&apos;s from a Cosmos
              wallet.
            </Text>
          </HStack>
        </FormErrorMessage>
      )}
    </Stack>
  )
}
