import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
import { VFC } from "react"
import { SecondaryButton } from "./SecondaryButton"
import { WithdrawModal } from "components/_modals/WithdrawModal"
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

export const WithdrawButton: VFC<
  ButtonProps & {
    isDeprecated?: boolean
  }
> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    // analytics.track("withdraw.cancelled")
    onClose()
  }
  const [isOracleModalOpen, setOracleModalOpen] = useState(false)
  const openOracleModal = () => setOracleModalOpen(true)
  const closeOracleModal = () => setOracleModalOpen(false)

  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]

  return (
    <>
      <>
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label={
            "Withdraw your funds from the cellar's liquid reserve."
          }
          placement="top"
          color="neutral.300"
          bg="surface.bg"
          textAlign="center"
        >
          <SecondaryButton
            onClick={(e) => {
              //! if share price oracle updating..
              //if (cellarData.slug === "Turbo-SOMM") {
              //  openOracleModal()
              //  return
              //}

              onOpen()
            }}
            {...props}
          >
            {props.isDeprecated
              ? "Withdraw Only"
              : "Withdraw"}
          </SecondaryButton>
        </Tooltip>
        <WithdrawModal isOpen={isOpen} onClose={closeModal} />
      </>
      {isOracleModalOpen && (
        <Modal
          isOpen={isOracleModalOpen}
          onClose={closeOracleModal}
          isCentered
        >
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
      )}
    </>
  )
}
