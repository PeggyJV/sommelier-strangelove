import { BaseToast } from 'components/_toasts/BaseToast'
import { ToastId, useToast, ToastOptions } from '@chakra-ui/react'
import { ReactNode, useRef } from 'react'

interface BaseToast extends Partial<ToastOptions> {
  body: ReactNode
  closeHandler?: () => void
  isLoading?: boolean
  icon?: any
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

  const update = ({
    body,
    closeHandler,
    isLoading,
    status,
    icon,
    ...rest
  }: BaseToast) => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        render: () => (
          <BaseToast
            status={status}
            closeHandler={closeHandler ?? close}
            isLoading={isLoading}
            icon={icon}
          >
            {body}
          </BaseToast>
        ),
        ...rest
      })
    }
  }

  const addToast = ({
    body,
    closeHandler,
    isLoading,
    status,
    icon,
    ...rest
  }: BaseToast) => {
    toastIdRef.current = toast({
      position: 'bottom-right',
      render: () => (
        <BaseToast
          status={status}
          closeHandler={closeHandler ?? close}
          isLoading={isLoading}
          icon={icon}
        >
          {body}
        </BaseToast>
      ),
      ...rest
    })
  }

  return { close, closeAll, update, addToast }
}
