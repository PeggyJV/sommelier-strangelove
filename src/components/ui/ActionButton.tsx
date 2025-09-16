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
    bg: "gradient.primary",
    color: "white",
    borderWidth: "2px",
    borderColor: "purple.base",
    _hover: { bg: "purple.dark" },
    _active: { bg: "purple.dark" },
    _disabled: {
      bg: "purple.dark",
      color: "neutral.400",
      borderColor: "purple.dark",
      cursor: "not-allowed",
      _hover: { bg: "purple.dark" },
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
      minW={fullWidth ? 0 : minW}
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
