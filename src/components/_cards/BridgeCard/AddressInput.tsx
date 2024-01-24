import { Box, FormErrorMessage, HStack, Image, Input, InputProps, Stack, Text } from "@chakra-ui/react"
import { Link } from "components/Link"
import { ExternalLinkIcon, InformationIcon, MoneyWalletIcon } from "components/_icons"
import { getKeplr, mainnetChains } from "graz"
import { useBrandedToast } from "hooks/chakra"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { validateSommelierAddress } from "utils/validateSommelierAddress"
import { isAddress } from "ethers/lib/utils"
import { BridgeFormValues } from "."
import { useAccount } from "wagmi"
import { Chain, ChainType } from "data/chainConfig"

interface AddressInputProps extends InputProps {
  chain: Chain;
}
export const AddressInput : React.FC<AddressInputProps> = ({
  children,
  chain,
  ...rest
}) => {
  const { addToast, closeAll } = useBrandedToast()
  const { register, setValue, getValues, getFieldState } =
    useFormContext<BridgeFormValues>()
  const isError = !!getFieldState("address").error
  const [_isActive, setActive] = useState(false)

  const { address, isConnected } = useAccount()

  const onSommAutofillClick = async (isValidateAddress?: boolean) => {
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
  const onEthereumAutofillClick = async (isValidateAddress?: boolean) => {
    try {
      if (!address) throw new Error("No wallet connected")
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

  const onAutofillClick = async (isValidateAddress?: boolean) => {
    if(chain.type === ChainType.Ethereum) {
      await onEthereumAutofillClick(isValidateAddress);
    }
    if(chain.type === ChainType.Cosmos) {
      await onSommAutofillClick(isValidateAddress);
    }
  }
  const validateAddress = (address: string) => {
    if(chain.type === ChainType.Cosmos) {
       return validateSommelierAddress(address)
    }
    if(chain.type === ChainType.Ethereum) {
      return isAddress(address)
    }
  }

  return (
    <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          {chain.displayName} Address
        </Text>

        {(chain.type === ChainType.Cosmos
          || chain.type === ChainType.Ethereum)
        &&
          <HStack
            as="button"
            type="button"
            spacing={1}
            onClick={() => onAutofillClick()}
          >
            {chain.type === ChainType.Ethereum
              ?
              <>
                <Text fontWeight="bold" color="white" fontSize="xs">
                  Import ETH address
                </Text>
                <MoneyWalletIcon boxSize="10px" />
              </>
              :
              <>
                <Text fontWeight="bold" color="white" fontSize="xs">
                  Import from Keplr
                </Text>
                <Image
                  src="/assets/images/keplr.png"
                  alt="Keplr logo"
                  width={4}
                />
              </>
            }
          </HStack>
        }
      </HStack>
      <Box
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={isError ? "redOutline1" : "purpleOutline1"}
        borderRadius="16px"
      >
        <Input
          id="address"
          placeholder={`Enter ${chain.displayName} address`}
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
            required: `Enter ${chain.displayName} address`,
            validate: {
              validAddress: (v) =>
                validateAddress(v) || "Address is not valid",
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

            {`Address is not a valid ${chain.displayName} address`}

          </Text>
        </HStack>
      </FormErrorMessage>
    </Stack>
  )
}
