import { ModalProps } from "@chakra-ui/react"
import { WithdrawQueueForm } from "components/_forms/WithdrawQueueForm"
import { VFC } from "react"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const SommelierTab: VFC<WithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  return <WithdrawQueueForm onClose={onClose} />
}
