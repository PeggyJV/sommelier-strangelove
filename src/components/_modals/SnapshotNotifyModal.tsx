// src/components/_modals/SnapshotNotifyModal.tsx

import { ModalProps, Text, Link } from "@chakra-ui/react"
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
      >
        Complete campaigns to earn bonus SOMM rewards and/or airdrop
        points.
      </Link>
    </BaseModal>
  )
}
