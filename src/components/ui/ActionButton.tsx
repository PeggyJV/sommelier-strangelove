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
    bg: "cta.filled.bg",
    color: "cta.filled.fg",
    _hover: { bg: "whiteAlpha.800" },
    _active: { bg: "whiteAlpha.900" },
    _disabled: {
      bg: "whiteAlpha.200",
      color: "whiteAlpha.600",
      cursor: "not-allowed",
      _hover: { bg: "whiteAlpha.200" },
    },
  },
  secondary: {
    variant: "outline",
    bg: "transparent",
    color: "cta.outline.fg",
    borderColor: "cta.outline.br",
    borderWidth: "2px",
    _hover: { bg: "white", color: "black", borderColor: "white" },
    _active: { bg: "white", color: "black", borderColor: "white" },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  danger: {
    colorScheme: "red",
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
  ghost: {
    variant: "ghost",
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
}

export default function ActionButton({
  variantStyle = "primary",
  fullWidth,
  height = "44px",
  minW = "148px",
  size = "md",
  borderRadius = "full",
  fontWeight = 600,
  ...rest
}: Props) {
  const tokens = variantTokens[variantStyle]
  return (
    <Button
      size={size}
      height={height}
      minW={minW}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      w={fullWidth ? "100%" : rest.w}
      {...tokens}
      {...rest}
      _focusVisible={{
        boxShadow: "0 0 0 3px var(--chakra-colors-purple-base)",
        ...(rest._focusVisible as object),
      }}
    />
  )
}
