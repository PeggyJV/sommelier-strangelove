import { ModalProps } from "@chakra-ui/react"
import { WithdrawForm } from "components/_forms/WithdrawForm"
import { VFC } from "react"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const SommelierTab: VFC<WithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  return <WithdrawForm onClose={onClose} />
}
