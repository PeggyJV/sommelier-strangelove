import { ButtonProps, useDisclosure } from "@chakra-ui/react"
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
import { Chain } from "src/data/chainConfig"

export const WithdrawQueueButton: VFC<
  ButtonProps & {
    chain: Chain
  }
> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function closeModal() {
    onClose()
  }

  return (
    <>
      <SecondaryButton
        onClick={(e) => {
          onOpen()
        }}
        {...props}
      >
        {"Enter Withdraw Queue"}
      </SecondaryButton>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
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
          <ModalHeader textAlign="center">Header!</ModalHeader>
          <ModalBody textAlign="center">
            <Text>yo</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
