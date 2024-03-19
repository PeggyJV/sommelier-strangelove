import React from "react"
import { Button, Stack } from "@chakra-ui/react"
import { useForm, FormProvider } from "react-hook-form"
import {
  InputEthereumAddress,
  InputSommelierAddress,
} from "components/_cards/SnapshotCard" // Adjust import paths as necessary
import {
  useAccount as useEthereumAccount,
  useConnect as useEthereumConnect,
} from "wagmi"
import {
  useAccount as useKeplrAccount,
  useConnect as useKeplrConnect,
} from "graz" // Assuming 'graz' provides these hooks or equivalent
import { signWithKeplr } from "utils/keplr" // Utility function for signing with Keplr

export const SnapshotForm = () => {
  const methods = useForm<SnapshotFormValues>()
  const { connect: connectEthereum } = useEthereumConnect()
  const { connect: connectKeplr } = useKeplrConnect() // Update according to actual Keplr connection method
  const { isConnected: isEthereumConnected } = useEthereumAccount()
  const { isConnected: isKeplrConnected } = useKeplrAccount() // Update based on actual hook results

  const onSubmit = async (data: SnapshotFormValues) => {
    try {
      if (!isKeplrConnected) {
        throw new Error("Keplr wallet is not connected")
      }
      // Signature generation and submission logic here...
      const signature = await signWithKeplr(data.somm_address)
      // Submit `data.eth_address`, `data.somm_address`, and `signature` to your backend
    } catch (error) {
      console.error("Error in form submission: ", error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <InputEthereumAddress />
          <InputSommelierAddress />
          <Button
            colorScheme="blue"
            onClick={() => connectEthereum()}
            isDisabled={isEthereumConnected}
          >
            {isEthereumConnected
              ? "Connected to Metamask"
              : "Connect Metamask"}
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => connectKeplr()}
            isDisabled={isKeplrConnected}
          >
            {isKeplrConnected
              ? "Connected to Keplr"
              : "Connect Keplr"}
          </Button>
          <Button
            type="submit"
            colorScheme="purple"
            isDisabled={!isEthereumConnected || !isKeplrConnected}
          >
            Link Addresses
          </Button>
        </Stack>
      </form>
    </FormProvider>
  )
}
