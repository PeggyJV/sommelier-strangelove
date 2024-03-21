import React, { useState } from "react"
import {
  Stack,
  Input,
  Text,
  HStack,
  FormErrorMessage,
  Image,
  Box,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { Link } from "components/Link"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { getKeplr, mainnetChains, useAccount } from "graz"
import { validateSommelierAddress } from "utils/validateSommelierAddress"
import { useBrandedToast } from "hooks/chakra"

export const InputSommelierAddress = ({ disabled, ...rest }) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getFieldState } = useFormContext()
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
          isDisabled={disabled}
          {...register("somm_address", {
            required: "Sommelier address is required",
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
              Sommelier address is not valid—make sure it's from a
              Cosmos wallet.
            </Text>
          </HStack>
        </FormErrorMessage>
      )}
    </Stack>
  )
}
