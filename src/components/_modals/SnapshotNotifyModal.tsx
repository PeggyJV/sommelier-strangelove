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
      heading="New Snapshot Page"
    >
      <Text color="neutral.300" fontSize="sm" mb="4">
        Don't miss out on bonus SOMM rewards! Link your wallets, join
        active campaigns like Redstone Points, and more on our
        Snapshots page.
      </Text>
      <Link href="/snapshots" color="teal.500" isExternal>
        Discover Rewards
      </Link>
    </BaseModal>
  )
}
