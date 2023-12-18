import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import ClientOnly from "components/ClientOnly"
import { DepositModal } from "components/_modals/DepositModal"
import { NotifyModal } from "components/_modals/NotifyModal"
import { VFC } from "react"
import { analytics } from "utils/analytics"
import { BaseButton } from "./BaseButton"
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { useState } from "react"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"

export const DepositButton: VFC<ButtonProps> = (props) => {
  const depositModal = useDisclosure()
  const notifyModal = useDisclosure()

  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const openOracleModal = () => setOracleModalOpen(true)
  const closeOracleModal = () => setOracleModalOpen(false)

  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]

  return (
    <ClientOnly>
      <BaseButton
        variant="solid"
        onClick={(e) => {
          e.stopPropagation()
          //! Turbo Somm share price oracle updating..
          if (cellarData.slug === "Turbo-SOMM") {
            openOracleModal()
            return
          }

          depositModal.onOpen()

          if (!depositModal.isOpen) {
            // analytics.track("deposit.modal-opened")
          }
        }}
        {...props}
      >
        Deposit
      </BaseButton>
      {isOracleModalOpen ? (
        <Modal isOpen={isOracleModalOpen} onClose={closeOracleModal} isCentered>
          <ModalOverlay />
          <ModalContent
            p={2}
            w="auto"
            zIndex={401}
            borderWidth={1}
            borderColor="purple.dark"
            borderRadius={12}
            bg="surface.bg"
            fontWeight="semibold"
            _focus={{
              outline: "unset",
              outlineOffset: "unset",
              boxShadow: "unset",
            }}
          >
            <ModalCloseButton />
            <ModalHeader textAlign="center">Notice!</ModalHeader>
            <ModalBody textAlign="center">
              <Text>
                Deposits and withdrawals have been temporarily
                disabled for Turbo SOMM while our oracle updates.
                Normal operations are set to resume on Dec 21st.
              </Text>
              <br />
              <Text>
                All user funds are safe. We appreciate your
                understanding.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <>
          <DepositModal
            isOpen={depositModal.isOpen}
            onClose={depositModal.onClose}
            notifyModal={notifyModal}
          />
          <NotifyModal
            isOpen={notifyModal.isOpen}
            onClose={notifyModal.onClose}
          />
        </>
      )}
    </ClientOnly>
  )
}
