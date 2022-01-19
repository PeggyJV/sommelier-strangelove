import {
  AlertDialog as ChDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogProps,
  Button
} from '@chakra-ui/react'

interface Props extends AlertDialogProps {
  title?: string
}

const AlertDialog = ({
  title,
  children,
  leastDestructiveRef,
  isOpen,
  onClose
}: Props) => {
  return (
    <ChDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={leastDestructiveRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChDialog>
  )
}

export default AlertDialog
