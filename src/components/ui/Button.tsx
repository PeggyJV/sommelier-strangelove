import {
  Button as CkButton,
  ButtonProps as CkProps,
} from "@chakra-ui/react"
import { forwardRef } from "react"

type Variant = "primary" | "secondary" | "danger" | "link"
type Size = "md" | "lg"

export interface UIButtonProps
  extends Omit<CkProps, "variant" | "size"> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const base = {
  fontSize: "base",
  fontWeight: 500,
  borderRadius: "xl",
  minH: "44px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition:
    "background-color .2s ease, color .2s ease, border-color .2s ease",
  // tabular nums
  sx: { fontFeatureSettings: '"tnum" on' },
}

const sizes: Record<Size, any> = {
  md: { py: 2, px: 4 },
  lg: { py: 3, px: 6 },
}

const variants: Record<Variant, any> = {
  primary: {
    color: "white",
    bgGradient: "linear(to-r, purple.500, blue.500)",
    _hover: { bgGradient: "linear(to-r, purple.600, blue.600)" },
    _active: { boxShadow: "inset 0 2px 6px rgba(0,0,0,.25)" },
    _focusVisible: {
      ring: 2,
      ringColor: "purple.400",
      ringOffset: 2,
    },
    _disabled: { opacity: 0.6, cursor: "not-allowed" },
  },
  secondary: {
    color: "gray.100",
    bg: "#1c1c1c",
    borderWidth: 1,
    borderColor: "gray.600",
    _hover: { bg: "gray.700" },
    _disabled: { opacity: 0.6, cursor: "not-allowed" },
  },
  danger: {
    color: "white",
    bg: "red.600",
    _hover: { bg: "red.700" },
    _active: { bg: "red.800" },
    _disabled: { opacity: 0.6, cursor: "not-allowed" },
  },
  link: {
    color: "purple.400",
    bg: "transparent",
    _hover: { textDecoration: "underline" },
  },
}

export const Button = forwardRef<HTMLButtonElement, UIButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...rest
    },
    ref
  ) => (
    <CkButton
      ref={ref}
      {...base}
      {...sizes[size]}
      {...variants[variant]}
      isLoading={isLoading}
      {...rest}
    >
      {children}
    </CkButton>
  )
)

Button.displayName = "UIButton"
