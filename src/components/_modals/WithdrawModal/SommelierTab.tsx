import { ModalProps } from "@chakra-ui/react"
import { WithdrawForm } from "components/_forms/WithdrawForm"
import { FC } from "react"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const SommelierTab: FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  return <WithdrawForm onClose={onClose} />
}
