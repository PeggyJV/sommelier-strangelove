import {
  AlertDialog as ChDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import { useDialog } from 'context/dialogContext'
import { useRef } from 'react'

const AlertDialog = () => {
  const { title, body, isOpen, onClose } = useDialog()
  const closeRef = useRef<HTMLButtonElement>(null)

  if (!isOpen) {
    return null
  }

  return (
    <ChDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={closeRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title ? title : 'Hello'}</AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={closeRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChDialog>
  )
}

export default AlertDialog
