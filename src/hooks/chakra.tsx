import { BaseToast } from 'components/_toasts/BaseToast'
import { ToastId, useToast, Status } from '@chakra-ui/react'
import { ReactNode, useRef } from 'react'

interface BaseToast {
  body: ReactNode
  status?: Status
  closeHandler?: () => void
  isLoading?: boolean
}

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

  const update = ({ body, closeHandler, isLoading, status }: BaseToast) => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        render: () => (
          <BaseToast
            status={status}
            closeHandler={closeHandler ?? close}
            isLoading={isLoading}
          >
            {body}
          </BaseToast>
        )
      })
    }
  }

  const addToast = ({ body, closeHandler, isLoading, status }: BaseToast) => {
    toastIdRef.current = toast({
      position: 'bottom-right',
      render: () => (
        <BaseToast
          status={status}
          closeHandler={closeHandler ?? close}
          isLoading={isLoading}
        >
          {body}
        </BaseToast>
      )
    })
  }

  return { close, closeAll, update, addToast }
}
