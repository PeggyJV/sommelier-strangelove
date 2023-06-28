import { ModalProps, UseDisclosureProps } from "@chakra-ui/react"
import { VFC } from "react"

import { SommelierTab } from "./SommelierTab"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal?: UseDisclosureProps
  id?: string
  activeAsset?: any
}

export const DepositModal: VFC<DepositModalProps> = ({
  notifyModal,
  ...props
}) => {
  return (
    <ModalWithExchangeTab
      id={props.id}
      heading="Deposit"
      sommelierTab={
        <SommelierTab {...props} notifyModal={notifyModal} />
      }
      {...props}
    />
  )
}
