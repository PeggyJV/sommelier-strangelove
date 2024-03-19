import React, { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useAccount as useEthereumAccount } from "wagmi"
import { BaseButton } from "components/_buttons/BaseButton"
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
  const { isConnected: isEthereumConnected } = useEthereumAccount()
  const toast = useToast()
  const { watch } = methods
  const ethAddress = watch("eth_address")
  const sommAddress = watch("somm_address")
  const isFormFilled = ethAddress && sommAddress

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
  }, [wrongNetwork, toast])

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
          <InputEthereumAddress disabled />
          <InputSommelierAddress disabled />
          <BaseButton
            height="69px"
            fontSize="21px"
            type="submit"
            colorScheme="purple"
            isDisabled={
              !isEthereumConnected || wrongNetwork || !isFormFilled
            }
          >
            Sign
          </BaseButton>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default SnapshotForm
