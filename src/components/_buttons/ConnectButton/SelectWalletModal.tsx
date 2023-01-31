import {
  ModalProps,
  HStack,
  Button,
  useToast,
  Image,
} from "@chakra-ui/react"
import { VFC } from "react"
import { BaseModal } from "components/_modals/BaseModal"
import { useAccount, useConnect } from "wagmi"
import { analytics } from "utils/analytics"

type Props = Pick<ModalProps, "isOpen" | "onClose">

export const SelectWalletModal: VFC<Props> = (props) => {
  const toast = useToast()

  const { connect, connectors, pendingConnector } = useConnect({
    onError: (error) => {
      toast({
        title: "Connection failed!",
        description: error.message,
        status: "error",
        isClosable: true,
      })

      analytics.track("wallet.connect-failed", {
        error: error.name,
        message: error.message,
      })
    },
    onSuccess: (data) => {
      const { account } = data

      if (account && account.length) {
        analytics.track("wallet.connect-succeeded", {
          account,
        })
      }
    },
  })
  const { isConnecting, connector: activeConnector } = useAccount()

  return (
    <BaseModal heading="Select Wallet" {...props}>
      <HStack justifyContent={"space-between"}>
        {connectors
          .filter((x) => x.ready && x.id !== activeConnector?.id)
          .map((x) => (
            <Button
              leftIcon={
                <Image
                  src={`/assets/icons/${x?.name?.toLowerCase()}.svg`}
                  alt="wallet logo"
                  boxSize={6}
                />
              }
              key={x.id}
              onClick={() => {
                connect({ connector: x })
              }}
            >
              {x.name}
              {isConnecting &&
                x.id === pendingConnector?.id &&
                " (connecting)"}
            </Button>
          ))}
      </HStack>
    </BaseModal>
  )
}
