import { HStack, Text, IconButton } from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"

type Props = {
  label: string
  onInfo?: (e: React.MouseEvent | React.KeyboardEvent) => void
  "aria-label"?: string
}

export function KpiLabelWithInfo({ label, onInfo, ...a11y }: Props) {
  return (
    <HStack spacing="1" align="center">
      <Text fontSize="xs" color="neutral.400">
        {label}
      </Text>
      <IconButton
        aria-label={(a11y as any)["aria-label"] ?? `About ${label}`}
        size="xs"
        variant="ghost"
        icon={<InformationIcon />}
        onClick={(e) => onInfo?.(e)}
        onKeyDown={(e) => {
          if ((e as any).key === "Enter" || (e as any).key === " ")
            onInfo?.(e)
        }}
      />
    </HStack>
  )
}
