import { ModalProps, UseDisclosureProps } from "@chakra-ui/react"
import { FC } from "react"

import { SommelierTab } from "./SommelierTab"
import { ModalWithExchangeTab } from "../ModalWithExchangeTab"

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal: UseDisclosureProps
}

export const DepositModal: FC<DepositModalProps> = ({
  notifyModal,
  ...props
}) => {
  return (
    <ModalWithExchangeTab
      heading="Deposit"
      sommelierTab={
        <SommelierTab {...props} notifyModal={notifyModal} />
      }
      {...props}
    />
  )
}
