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
import { AiOutlineInfo } from "react-icons/ai"
import { ImCheckmark } from "react-icons/im"
import { IconType } from "react-icons"

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
          bg: "darkYellow",
        }
      : status === "success"
      ? {
          bg: "darkLime",
        }
      : status === "error"
      ? {
          bg: "darkOrange",
        }
      : {
          bg: "darkTurquoise",
        }

  const dynamicStackStyles: StackProps =
    status === "info"
      ? {
          bg: "transparentYellow",
        }
      : status === "success"
      ? {
          bg: "transparentLime",
        }
      : status === "error"
      ? {
          bg: "transparentOrange",
        }
      : {
          bg: "transparentTurquoise",
        }

  const dynamicHeadingStyles: HeadingProps =
    status === "info"
      ? {
          color: "energyYellow",
        }
      : status === "success"
      ? {
          color: "lime.base",
        }
      : status === "error"
      ? {
          color: "red.base",
        }
      : {
          color: "turquoise",
        }

  const dynamicIconStyles: IconProps =
    status === "info"
      ? {
          color: "energyYellow",
          borderColor: "energyYellow",
        }
      : status === "success"
      ? {
          color: "lime.base",
          borderColor: "lime.base",
        }
      : status === "error"
      ? {
          color: "red.base",
          borderColor: "red.base",
        }
      : {
          color: "turquoise",
          borderColor: "turquoise",
        }

  const dynamicIcon: IconType | undefined =
    status === "info"
      ? AiOutlineInfo
      : status === "success"
      ? ImCheckmark
      : status === "error"
      ? AiOutlineInfo
      : AiOutlineInfo

  return {
    dynamicBoxStyles,
    dynamicStackStyles,
    dynamicHeadingStyles,
    dynamicIconStyles,
    dynamicIcon,
  }
}
