import React, { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import {
  useAccount as useEthereumAccount,
  useConnect as useEthereumConnect,
} from "wagmi"
import { Button, Stack, useToast } from "@chakra-ui/react"
import { signWithKeplr } from "utils/keplr"
import { InputEthereumAddress } from "components/_cards/SnapshotCard/InputEthereumAddress"
import { InputSommelierAddress } from "components/_cards/SnapshotCard/InputSommelierAddress"

interface SnapshotFormProps {
  wrongNetwork: boolean
}

interface SnapshotFormValues {
  eth_address: string
  somm_address: string
}

const SnapshotForm: React.FC<SnapshotFormProps> = ({
  wrongNetwork,
}) => {
  const methods = useForm<SnapshotFormValues>()
  const { connect: connectEthereum } = useEthereumConnect()
  const { isConnected: isEthereumConnected } = useEthereumAccount()
  const toast = useToast()

  useEffect(() => {
    if (wrongNetwork) {
      toast({
        title: "Network Error",
        description: "You're connected to the wrong network.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }, [wrongNetwork])

  const onSubmit = async (data: SnapshotFormValues) => {
    if (!isEthereumConnected || wrongNetwork) {
      toast({
        title: "Submission Error",
        description:
          "Please check your wallet connection and network.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      return
    }
    try {
      // Assuming signWithKeplr can be called directly without needing a Keplr-specific hook
      const signature = await signWithKeplr(data.somm_address)
      console.log("Signature obtained:", signature)
      // Handle the submission of form data and the signature to your backend here
    } catch (error) {
      console.error("Error in form submission: ", error)
      toast({
        title: "Error",
        description:
          "There was an error submitting your form. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
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
          {/* Removed Keplr connect button as its functionality needs to be adjusted without useKeplrConnect */}
          <Button
            type="submit"
            colorScheme="purple"
            isDisabled={!isEthereumConnected || wrongNetwork}
          >
            Link Addresses
          </Button>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default SnapshotForm
