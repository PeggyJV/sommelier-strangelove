import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { VFC } from "react"
import { BaseButton } from "./BaseButton"
import { analytics } from "utils/analytics"
import { DepositModal } from "components/_modals/DepositModal"
import { NotifyModal } from "components/_modals/NotifyModal"

export const DepositButton: VFC<ButtonProps> = (props) => {
  const depositModal = useDisclosure()
  const notifyModal = useDisclosure()

  function onClick() {
    depositModal.onOpen()

    if (!depositModal.isOpen) {
      analytics.track("deposit.modal-opened")
    }
  }

  return (
    <ClientOnly>
      <BaseButton variant="solid" onClick={onClick} {...props}>
        Buy
      </BaseButton>
      <DepositModal
        isOpen={depositModal.isOpen}
        onClose={depositModal.onClose}
        notifyModal={notifyModal}
      />
      <NotifyModal
        isOpen={notifyModal.isOpen}
        onClose={notifyModal.onClose}
      />
    </ClientOnly>
  )
}
