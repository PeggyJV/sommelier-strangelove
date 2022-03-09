import { BaseToast } from 'components/_toasts/BaseToast'
import { ToastId, useToast } from '@chakra-ui/react'
import { useRef } from 'react'

export const useBrandedToast = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()

  const close = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current)
    }
  }

  const closeAll = () => {
    toast.closeAll()
  }

  const addToast = () => {
    toastIdRef.current = toast({
      position: 'bottom-right',
      render: () => <BaseToast>Hello</BaseToast>
    })
  }

  return { close, closeAll, addToast }
}
