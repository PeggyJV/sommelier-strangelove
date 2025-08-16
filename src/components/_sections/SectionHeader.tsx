import { Badge, HStack, Heading } from "@chakra-ui/react"

export default function SectionHeader({
  title,
  pill,
  pillColor,
}: {
  title: string
  pill?: string
  pillColor?: string
}) {
  return (
    <HStack justify="space-between" mb={3} mt={8}>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      {pill && (
        <Badge
          colorScheme={pillColor}
          variant="outline"
          fontSize="0.8rem"
        >
          {pill}
        </Badge>
      )}
    </HStack>
  )
}
