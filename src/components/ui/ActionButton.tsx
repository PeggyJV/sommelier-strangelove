import { Button, ButtonProps } from "@chakra-ui/react"

export type ActionButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"

type Props = ButtonProps & {
  variantStyle?: ActionButtonVariant
  fullWidth?: boolean
}

const variantTokens: Record<
  ActionButtonVariant,
  Partial<ButtonProps>
> = {
  primary: {
    bg: "brand.primary",
    color: "text.primary",
    borderWidth: "2px",
    borderColor: "brand.primary",
    _hover: {
      bg: "brand.secondary",
      borderColor: "brand.secondary",
    },
    _active: {
      bg: "brand.secondary",
      borderColor: "brand.secondary",
    },
    _disabled: {
      bg: "brand.surface",
      color: "text.secondary",
      borderColor: "border.subtle",
      cursor: "not-allowed",
      _hover: { bg: "brand.surface" },
    },
  },
  secondary: {
    variant: "outline",
    bg: "transparent",
    color: "text.primary",
    borderColor: "border.subtle",
    borderWidth: "2px",
    _hover: {
      bg: "brand.surface",
      borderColor: "brand.primary",
    },
    _active: {
      bg: "brand.surface",
      borderColor: "brand.primary",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  danger: {
    bg: "state.error",
    color: "text.primary",
    borderWidth: "2px",
    borderColor: "state.error",
    _hover: {
      bg: "#CC3D3F",
      borderColor: "#CC3D3F",
    },
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
  ghost: {
    variant: "ghost",
    color: "text.secondary",
    _hover: {
      bg: "brand.surface",
      color: "text.primary",
    },
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
}

export default function ActionButton({
  variantStyle = "primary",
  fullWidth,
  height = "44px",
  minW = "148px",
  size = "md",
  borderRadius = "md",
  fontWeight = 600,
  ...rest
}: Props) {
  const tokens = variantTokens[variantStyle]
  return (
    <Button
      size={size}
      height={height}
      minW={fullWidth ? 0 : minW}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      w={fullWidth ? "100%" : rest.w}
      {...tokens}
      {...rest}
      _focusVisible={{
        boxShadow: "0 0 0 3px var(--chakra-colors-brand-primary)",
        ...(rest._focusVisible as object),
      }}
    />
  )
}
