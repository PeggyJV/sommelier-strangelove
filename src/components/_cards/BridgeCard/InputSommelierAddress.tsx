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
import { BridgeFormValues } from "."

export const InputSommelierAddress: React.FC<InputProps> = ({
  children,
  ...rest
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getValues, getFieldState } =
    useFormContext<BridgeFormValues>()
  const isError = !!getFieldState("address").error
  const [isActive, setActive] = useState(false)
  const { isConnected } = useAccount()

  const onAutofillClick = async (isValidateAddress?: boolean) => {
    try {
      const keplr = getKeplr()
      const key = await keplr.getKey(mainnetChains.sommelier.chainId)
      if (!key.bech32Address) throw new Error("Address not defined")
      setValue(
        "address",
        isValidateAddress ? getValues().address : key.bech32Address,
        {
          shouldValidate: true,
        }
      )
    } catch (e) {
      const error = e as Error
      if (error.message === "Keplr is not defined") {
        return addToast({
          heading: "Import from Keplr",
          body: (
            <>
              <Text>Keplr not found</Text>
              <Link
                display="flex"
                alignItems="center"
                href="https://www.keplr.app/download"
                isExternal
              >
                <Text as="span">Install Keplr</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
            </>
          ),
          status: "error",
          closeHandler: closeAll,
        })
      }
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
          spacing={1}
          onClick={() => onAutofillClick()}
        >
          <Text fontWeight="bold" color="white" fontSize="xs">
            Import from Keplr
          </Text>
          <Image
            src="/assets/images/keplr.png"
            alt="Keplr logo"
            width={4}
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
          id="sommelierAddress"
          placeholder="Enter Sommelier address"
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
            required: "Enter Sommelier address",
            validate: {
              validAddress: (v) =>
                validateSommelierAddress(v) || "Address is not valid",
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
            Address is not valid—make sure Sommelier address is from a
            Cosmos wallet
          </Text>
        </HStack>
      </FormErrorMessage>
    </Stack>
  )
}
