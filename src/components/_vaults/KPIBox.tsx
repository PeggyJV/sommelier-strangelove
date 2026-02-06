import { Stack, Text, StackProps } from "@chakra-ui/react"

type KPIBoxProps = StackProps & {
  label: string
  value?: string | number | null
  align?: "left" | "center" | "right"
  fontVariantNumeric?: "tabular-nums" | "normal"
}

export default function KPIBox({
  label,
  value,
  align = "left",
  fontVariantNumeric = "tabular-nums",
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
      minW={0}
      {...rest}
    >
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight={800}
        lineHeight={1}
        sx={{ fontVariantNumeric }}
        isTruncated
      >
        {value ?? ""}
      </Text>
      <Text fontSize="xs" color="neutral.400" isTruncated>
        {label}
      </Text>
    </Stack>
  )
}
