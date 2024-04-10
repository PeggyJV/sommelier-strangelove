// src/components/_modals/SnapshotNotifyModal.tsx
import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Link,
  Box,
  Text,
} from "@chakra-ui/react"

const SnapshotNotifyModal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check sessionStorage to decide if the modal should be opened
    const shouldShowModal = sessionStorage.getItem("showModalOnLoad")

    if (shouldShowModal !== "false") {
      setIsOpen(true)
      // Set the flag to false after showing the modal once
      sessionStorage.setItem("showModalOnLoad", "false")
    }
  }, [])

  const bgColor = useColorModeValue("blue.50", "blue.900")

  const headingElement = (
    <Box p={4}>
      <Link
        href="/snapshot"
        isExternal
        style={{ textDecoration: "underline", display: "block" }}
      >
        <Text fontSize="lg" textAlign="center">
          Unlock RedStone RSG Points: Act Now Before They're Gone!
        </Text>
      </Link>
    </Box>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>{headingElement}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Modal body content can be placed here */}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SnapshotNotifyModal
