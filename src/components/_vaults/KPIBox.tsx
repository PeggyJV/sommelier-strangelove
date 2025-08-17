import { Box, Stack, Text, StackProps } from "@chakra-ui/react"

type KPIBoxProps = StackProps & {
  label: string
  value?: string | number | null
  align?: "left" | "center" | "right"
}

export default function KPIBox({
  label,
  value,
  align = "left",
  ...rest
}: KPIBoxProps) {
  return (
    <Stack
      spacing={1}
      align={
        align === "left"
          ? "flex-start"
          : align === "right"
          ? "flex-end"
          : "center"
      }
      {...rest}
    >
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight={800}
        lineHeight={1}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value ?? ""}
      </Text>
      <Text fontSize="xs" color="neutral.400">
        {label}
      </Text>
    </Stack>
  )
}
