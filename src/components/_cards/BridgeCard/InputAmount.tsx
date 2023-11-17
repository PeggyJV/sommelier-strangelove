import {
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react"
import React, { useState } from "react"

import Image from "next/image"
import { useAccount, useBalance } from "wagmi"
import { getAddress } from "ethers/lib/utils.js"
import {
  useBalances as useGrazBalances,
  useAccount as useGrazAccount,
  mainnetChains,
} from "graz"
import { toEther } from "utils/formatCurrency"
import { useFormContext } from "react-hook-form"
import { BridgeFormValues } from "."
import { InformationIcon } from "components/_icons"
import { config } from "utils/config"
import { useNetwork } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { tokenConfig } from "data/tokenConfig"

export const InputAmount: React.FC = () => {
  const { register, setValue, formState, getFieldState, watch } =
    useFormContext<BridgeFormValues>()
  const watchType = watch("type")
  const toSomm = watchType === "TO_SOMMELIER"
  const toEth = watchType === "TO_ETHEREUM"

  const isError = !!getFieldState("amount").error
  const [isActive, setActive] = useState(false)
  const { address, isConnecting } = useAccount()

  // Get chain id
  const { chain } = useNetwork()
  const chainObj = chainConfig.find((c) => c.wagmiId === chain?.id)!
  const sommToken = tokenConfig.find(
    (t) => t.coinGeckoId === "sommelier" && t.chain === "ethereum"
  )!
  // TODO: Change to below once we adjust for multichain
  //const sommToken = tokenConfig.find(
  //  (t) => t.coinGeckoId === "sommelier" && t.chain === chainObj.id
  //)!

  const { data, error, isLoading } = useBalance({
    address: address,
    token: getAddress(sommToken.address),
    watch: true,
  })

  const { isConnecting: isGrazConnecting } = useGrazAccount()
  const {
    data: grazData,
    isLoading: isGrazLoading,
    error: grazError,
  } = useGrazBalances()
  const sommBalance = grazData?.find((item) => item.denom === "usomm")
  const sommDecimal =
    mainnetChains.sommelier.currencies.find(
      (item) => item.coinMinimalDenom === "usomm"
    )?.coinDecimals || 6

  const isBalanceLoading = toSomm
    ? isConnecting || isLoading
    : isGrazConnecting || isGrazLoading
  const onMaxButtonClick = () => {
    if (toSomm && data) {
      const amount = parseFloat(
        toEther(data.value, data.decimals, false)
      )
      setValue("amount", amount, { shouldValidate: true })
    } else if (toEth && sommBalance) {
      const amount = parseFloat(
        toEther(sommBalance.amount, sommDecimal, false)
      )
      setValue("amount", amount, { shouldValidate: true })
    }
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
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        boxShadow={
          isError
            ? "redOutline1"
            : isActive
            ? "purpleOutline1"
            : "none"
        }
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
            autoComplete="off"
            autoCorrect="off"
            {...register("amount", {
              required: "Enter amount",
              valueAsNumber: true,
              validate: {
                positive: (v) =>
                  v > 0 || "You must submit a positive amount.",
                balance: (v) =>
                  toSomm
                    ? (data &&
                        v <=
                          parseFloat(
                            toEther(data.value, data.decimals, false)
                          )) ||
                      "Insufficient balance"
                    : (sommBalance &&
                        v <=
                          parseFloat(
                            toEther(
                              sommBalance.amount,
                              sommDecimal,
                              false
                            )
                          )) ||
                      "Insufficient balance",
                minimal: (v) =>
                  toEth
                    ? v >= 50 || "Amount must be greater than 50"
                    : true,
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
                  {toSomm
                    ? (data && toEther(data.value, data.decimals)) ||
                      "--"
                    : (sommBalance &&
                        toEther(sommBalance.amount, sommDecimal)) ||
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
        <HStack spacing="6px">
          <InformationIcon color="red.base" boxSize="12px" />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {formState.errors.amount.message}
          </Text>
        </HStack>
      )}
      {((toEth && grazError) || (toSomm && error)) && (
        <HStack spacing="6px">
          <InformationIcon color="red.base" boxSize="12px" />
          <Text fontSize="xs" fontWeight="semibold" color="red.light">
            {(toEth && error?.message) ||
              // @ts-expect-error
              (toSomm && grazError?.message)}
          </Text>
        </HStack>
      )}
    </Stack>
  )
}
