import { createContext, FC, useContext, useState } from 'react'

export interface DialogContext {
  title?: string
  body?: any
  isOpen?: boolean
  openDialog: (title?: string, body?: any) => void
  onClose: () => void
}

const defaultContext: DialogContext = {
  title: '',
  body: '',
  onClose: () => {},
  openDialog: () => {}
}

export const dialogContext = createContext<DialogContext>(defaultContext)

export const DialogProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [body, setBody] = useState<string>()

  const openDialog = (title?: string, body?: any) => {
    setIsOpen(true)
    setTitle(title)
    if (body) setBody(body)
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
