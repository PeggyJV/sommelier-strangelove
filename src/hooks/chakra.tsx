import { BaseToast } from "components/_toasts/BaseToast"
import {
  ToastId,
  useToast,
  ToastOptions,
  Status,
  BoxProps,
  StackProps,
  HeadingProps,
  IconProps,
} from "@chakra-ui/react"
import { ReactNode, useRef } from "react"
import { InformationIcon, WarningIcon } from "components/_icons"
import { SuccessIcon } from "components/_icons/SuccessIcon"

interface BaseToast extends Partial<ToastOptions> {
  body: ReactNode
  closeHandler?: () => void
  isLoading?: boolean
  heading?: string
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
    heading,
    ...rest
  }: BaseToast) => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        render: () => (
          <BaseToast
            status={status}
            closeHandler={closeHandler ?? close}
            isLoading={isLoading}
            heading={heading}
          >
            {body}
          </BaseToast>
        ),
        ...rest,
      })
    }
  }

  const addToast = ({
    body,
    closeHandler,
    isLoading,
    status,
    heading,
    ...rest
  }: BaseToast) => {
    toastIdRef.current = toast({
      position: "bottom-right",
      render: () => (
        <BaseToast
          status={status}
          closeHandler={closeHandler ?? close}
          isLoading={isLoading}
          heading={heading}
        >
          {body}
        </BaseToast>
      ),
      ...rest,
    })
  }

  return { close, closeAll, update, addToast }
}

export const useToastStyles = (status?: Status) => {
  const dynamicBoxStyles: BoxProps =
    status === "info"
      ? {
          bg: "orange.dark",
          borderWidth: 1,
          borderColor: "orange.base",
        }
      : status === "success"
      ? {
          bg: "turquoise.dark",
          borderWidth: 1,
          borderColor: "turquoise.base",
        }
      : status === "error"
      ? {
          bg: "red.dark",
          borderWidth: 1,
          borderColor: "red.base",
        }
      : {
          bg: "lime.dark",
          borderWidth: 1,
          borderColor: "lime.base",
        }

  const dynamicStackStyles: StackProps =
    status === "info"
      ? {
          bg: "orange.dark",
        }
      : status === "success"
      ? {
          bg: "turquoise.dark",
        }
      : status === "error"
      ? {
          bg: "red.dark",
        }
      : {
          bg: "lime.dark",
        }

  const dynamicHeadingStyles: HeadingProps =
    status === "info"
      ? {
          color: "orange.light",
        }
      : status === "success"
      ? {
          color: "turquoise.light",
        }
      : status === "error"
      ? {
          color: "red.light",
        }
      : {
          color: "lime.light",
        }

  const dynamicIconStyles: IconProps =
    status === "info"
      ? {
          color: "orange.base",
          borderColor: "orange.base",
        }
      : status === "success"
      ? {
          color: "turquoise.base",
          borderColor: "turquoise.base",
        }
      : status === "error"
      ? {
          color: "red.base",
          borderColor: "red.base",
        }
      : {
          color: "lime.base",
          borderColor: "lime.base",
        }

  const dynamicIcon =
    status === "info"
      ? InformationIcon
      : status === "success"
      ? SuccessIcon
      : status === "error"
      ? WarningIcon
      : InformationIcon

  return {
    dynamicBoxStyles,
    dynamicStackStyles,
    dynamicHeadingStyles,
    dynamicIconStyles,
    dynamicIcon,
  }
}
