import { HStack, Text, IconButton } from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"

type Props = {
  label: string
  onInfo?: (e: React.MouseEvent | React.KeyboardEvent) => void
  "aria-label"?: string
}

export function KpiLabelWithInfo({ label, onInfo, ...a11y }: Props) {
  const ariaLabel = a11y["aria-label"]

  return (
    <HStack spacing="1" align="center">
      <Text fontSize="xs" color="neutral.400">
        {label}
      </Text>
      <IconButton
        aria-label={ariaLabel ?? `About ${label}`}
        size="xs"
        variant="ghost"
        icon={<InformationIcon />}
        onClick={(e) => onInfo?.(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            onInfo?.(e)
        }}
      />
    </HStack>
  )
}
