import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { DepositModal } from "components/_modals/DepositModal"
import { VFC } from "react"
import { BaseButton } from "./BaseButton"

export const DepositButton: VFC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ClientOnly>
      <BaseButton variant="solid" onClick={onOpen} {...props}>
        Deposit
      </BaseButton>
      <DepositModal isOpen={isOpen} onClose={onClose} />
    </ClientOnly>
  )
}
