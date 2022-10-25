import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { DepositModal } from "components/_modals/DepositModal"
import { VFC } from "react"
import { BaseButton } from "./BaseButton"
import { analytics } from "utils/analytics"

export const DepositButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function onClick() {
    onOpen()

    if (!isOpen) {
      analytics.track("deposit.modal-opened")
    }
  }

  return (
    <ClientOnly>
      <BaseButton variant="solid" onClick={onClick} {...props}>
        Buy
      </BaseButton>
      <DepositModal isOpen={isOpen} onClose={onClose} />
    </ClientOnly>
  )
}
