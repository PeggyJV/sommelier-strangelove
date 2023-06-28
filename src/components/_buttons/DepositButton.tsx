import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { DepositModal } from "components/_modals/DepositModal"
import { NotifyModal } from "components/_modals/NotifyModal"
import { VFC } from "react"
import { analytics } from "utils/analytics"
import { BaseButton } from "./BaseButton"

export const DepositButton: VFC<
  ButtonProps & {
    id?: string
  }
> = (props) => {
  const depositModal = useDisclosure()
  const notifyModal = useDisclosure()

  return (
    <ClientOnly>
      <BaseButton
        variant="solid"
        onClick={(e) => {
          e.stopPropagation()
          depositModal.onOpen()

          if (!depositModal.isOpen) {
            analytics.track("deposit.modal-opened")
          }
        }}
        {...props}
      >
        Deposit
      </BaseButton>
      <DepositModal
        id={props.id}
        isOpen={depositModal.isOpen}
        onClose={depositModal.onClose}
        notifyModal={notifyModal}
      />
      <NotifyModal
        id={props.id}
        isOpen={notifyModal.isOpen}
        onClose={notifyModal.onClose}
      />
    </ClientOnly>
  )
}
