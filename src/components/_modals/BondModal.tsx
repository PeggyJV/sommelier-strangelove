import { ModalProps } from "@chakra-ui/react"
import { BondForm } from "components/_forms/BondForm"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"

type BondModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const BondModal: VFC<BondModalProps> = (props) => {
  return (
    <BaseModal heading="Bond" {...props}>
      <BondForm onClose={props.onClose} />
    </BaseModal>
  )
}
