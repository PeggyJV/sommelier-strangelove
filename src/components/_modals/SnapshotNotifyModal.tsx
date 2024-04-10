import { ModalProps, Link } from "@chakra-ui/react"
import { BaseModal } from "./BaseModal"
import { useEffect } from "react"

export const SnapshotNotifyModal = ({
  isOpen,
  onClose,
}: Pick<ModalProps, "isOpen" | "onClose">) => {
  useEffect(() => {
    // Logic here if needed, e.g., analytics
  }, [isOpen])

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      heading="Connect Wallet on Snapshot"
    >
      <Link
        href="/snapshot"
        color="white.500"
        textDecoration="underline"
        isExternal
        fontSize="sm" // Adjust the font size here. Options include "xs", "sm", "md", etc.
        className="oneLineText"
      >
        Unlock RedStone RSG Points: Act Now Before They're Gone!
      </Link>
    </BaseModal>
  )
}
