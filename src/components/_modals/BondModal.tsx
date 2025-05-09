import { ModalProps } from "@chakra-ui/react"
import { BondForm } from "components/_forms/BondForm"
import { FC } from "react"
import { BaseModal } from "./BaseModal"

type BondModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const BondModal: FC<BondModalProps> = (props) => {
  return (
    <BaseModal heading="Bond" {...props}>
      <BondForm onClose={props.onClose} />
    </BaseModal>
  )
}
