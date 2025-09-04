import { HStack, Text } from "@chakra-ui/react"

export default function MetricsRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone?: "default" | "positive" | "negative"
}) {
  const color =
    tone === "positive"
      ? "green.300"
      : tone === "negative"
      ? "red.300"
      : undefined
  return (
    <HStack
      className="w-full"
      justify="space-between"
      align="center"
      px={{ base: 0, md: 0 }}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        color="neutral.400"
        noOfLines={1}
        title={label}
      >
        {label}
      </Text>
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight={800}
        color={color}
        textAlign="right"
      >
        {String(value)}
      </Text>
    </HStack>
  )
}
