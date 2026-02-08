import { createContext, FC, ReactNode, useContext, useState } from "react"

export interface DialogContext {
  title?: string
  body?: ReactNode
  isOpen?: boolean
  openDialog: (title?: string, body?: ReactNode) => void
  onClose: () => void
}

const defaultContext: DialogContext = {
  title: '',
  body: null,
  onClose: () => {},
  openDialog: () => {}
}

export const dialogContext = createContext<DialogContext>(defaultContext)

export const DialogProvider: FC<{ children: ReactNode; }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [body, setBody] = useState<ReactNode>()

  const openDialog = (title?: string, body?: ReactNode) => {
    setIsOpen(true)
    setTitle(title)
    if (body !== undefined) setBody(body)
  }

  const onClose = () => setIsOpen(false)

  const value = {
    title,
    body,
    isOpen,
    openDialog,
    onClose
  }

  return (
    <dialogContext.Provider value={value}>{children}</dialogContext.Provider>
  )
}

export const useDialog = () => useContext(dialogContext)
