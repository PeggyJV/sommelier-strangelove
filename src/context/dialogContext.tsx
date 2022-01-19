import { useRouter } from 'next/router'
import { createContext, FC, useState, useEffect, useContext } from 'react'

interface DialogContextProps {
  currentDialog: string | null
  dialogData?: any
  closeDialog?: () => void
  openDialog?: (dialog: string, data?: any) => void
}

const DialogContext = createContext<DialogContextProps | null>(null)

export const DialogProvider: FC = ({ children }) => {
  const [currentDialog, setCurrentDialog] = useState<string | null>(null)
  const [dialogData, setDialogData] = useState<any>(null)
  const router = useRouter()

  /**
   * When the route changes, close the dialog.
   */
  useEffect(() => {
    closeDialog()
  }, [router])

  const closeDialog = () => setCurrentDialog(null)

  const openDialog = (dialog: string, data?: any) => {
    setCurrentDialog(dialog)
    if (data) setDialogData(data)
  }

  const values: DialogContextProps = {
    currentDialog,
    dialogData,
    closeDialog,
    openDialog
  }
  return (
    <DialogContext.Provider value={values}>{children}</DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)

export default DialogContext
