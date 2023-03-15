import {
  Stack,
  Center,
  Text,
  FormControl,
  IconButton,
  Image,
  Flex,
  HStack,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import ConnectButton from "components/_buttons/ConnectButton"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputEthereumAddress } from "components/_cards/BridgeCard/InputEthereumAddress"
import { InputSommelierAddress } from "components/_cards/BridgeCard/InputSommelierAddress"
import { SommelierAddress } from "components/_cards/BridgeCard/SommelierAddress"
import { SommReceivedInEth } from "components/_cards/BridgeCard/SommReceivedInEth"
import { TimerIcon } from "components/_icons"
import {
  useAccount as useGrazAccount,
  useConnect as useGrazConnect,
} from "graz"
import { useIsMounted } from "hooks/utils/useIsMounted"
import { useBridgeEthToSommTx } from "hooks/web3/useBridgeEthToSommTx"
import { useBridgeSommToEthTx } from "hooks/web3/useBridgeSommToEthTx"
import { VFC } from "react"
import { useFormContext } from "react-hook-form"
import { useAccount } from "wagmi"

export const BridgeForm: VFC = () => {
  const isMounted = useIsMounted()
  const { watch, handleSubmit, formState, getFieldState, setValue } =
    useFormContext<BridgeFormValues>()

  const watchType = watch("type")
  const toSomm = watchType === "TO_SOMMELIER"
  const toEth = watchType === "TO_ETHEREUM"
  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("address")

  const { isLoading: isEthToSommLoading, doEthToSomm } =
    useBridgeEthToSommTx()
  const { isLoading: isSommToEthLoading, doSommToEth } =
    useBridgeSommToEthTx()

  const isLoading = isEthToSommLoading || isSommToEthLoading

  const isDisabled =
    isNaN(watchAmount) ||
    watchAmount <= 0 ||
    !!getFieldState("amount").error ||
    !!getFieldState("address").error ||
    !watchSommelierAddress ||
    isEthToSommLoading ||
    isSommToEthLoading

  const { connect } = useGrazConnect()
  const { isConnected: isGrazConnected } = useGrazAccount()

  const { isConnected } = useAccount()

  const buttonEnabled =
    (isConnected && toSomm) || (isGrazConnected && toEth)

  const Eth = () => (
    <HStack
      borderRadius="16px"
      borderWidth="1px"
      borderColor="neutral.600"
      p={2}
      px={4}
    >
      <Image
        src="/assets/icons/eth.png"
        alt="eth"
        w="16px"
        h="16px"
      />
      <Text fontWeight="bold">Ethereum</Text>
    </HStack>
  )
  const Somm = () => (
    <HStack
      borderRadius="16px"
      borderWidth="1px"
      borderColor="neutral.600"
      p={2}
      px={4}
    >
      <Image
        src="/assets/images/coin.png"
        alt="eth"
        w="16px"
        h="16px"
      />
      <Text fontWeight="bold">Sommelier</Text>
    </HStack>
  )
  return (
    <Stack
      spacing="40px"
      as="form"
      onSubmit={
        watchType === "TO_SOMMELIER"
          ? handleSubmit(doEthToSomm)
          : handleSubmit(doSommToEth)
      }
    >
      <Stack spacing={6}>
        <HStack justifyContent="space-between">
          <Stack flex={1}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              From
            </Text>
            {watchType === "TO_SOMMELIER" ? <Eth /> : <Somm />}
          </Stack>

          <Flex justifyContent={"center"} alignSelf="flex-end" pb={2}>
            <IconButton
              aria-label="swap icon"
              variant="unstyled"
              size="sm"
              icon={
                <Image
                  src="/assets/images/swap.svg"
                  alt="swap icon"
                />
              }
              disabled={isLoading}
              onClick={() =>
                setValue(
                  "type",
                  watchType === "TO_SOMMELIER"
                    ? "TO_ETHEREUM"
                    : "TO_SOMMELIER"
                )
              }
            />
          </Flex>
          <Stack flex={1}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              To
            </Text>
            {watchType === "TO_SOMMELIER" ? <Somm /> : <Eth />}
          </Stack>
        </HStack>
        <FormControl
          isInvalid={formState.errors.amount as boolean | undefined}
        >
          <InputAmount />
        </FormControl>
        {watchType === "TO_SOMMELIER" ? (
          <EthereumAddress />
        ) : (
          <SommelierAddress />
        )}
        <FormControl
          isInvalid={formState.errors.address as boolean | undefined}
        >
          {watchType === "TO_SOMMELIER" ? (
            <InputSommelierAddress />
          ) : (
            <InputEthereumAddress />
          )}
        </FormControl>
        {watchType === "TO_ETHEREUM" && <SommReceivedInEth />}
      </Stack>
      {isMounted &&
        (buttonEnabled ? (
          <BaseButton
            disabled={isDisabled}
            isLoading={isLoading}
            type="submit"
            height="69px"
            fontSize="21px"
          >
            Bridge $SOMM
          </BaseButton>
        ) : toSomm ? (
          <ConnectButton unstyled height="69px" fontSize="21px">
            Connect Ethereum Wallet
          </ConnectButton>
        ) : (
          <BaseButton
            height="69px"
            fontSize="21px"
            onClick={() => connect()}
          >
            Connect Cosmos Wallet
          </BaseButton>
        ))}

      <Center>
        <TimerIcon color="orange.base" boxSize="12px" mr="6px" />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="orange.light"
        >
          Transaction should process within{" "}
          {watchType === "TO_SOMMELIER" ? "10-15" : "1-5"} minutes.
        </Text>
      </Center>
    </Stack>
  )
}
