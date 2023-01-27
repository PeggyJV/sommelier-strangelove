import {
  Flex,
  Heading,
  HStack,
  Spinner,
  Tooltip,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import { Label } from "./Label"

interface CellarStatsProps {
  isLoading?: boolean
  title: string
  tooltip?: string
  value: string
  size?: string
}

export const CellarStats = ({
  isLoading,
  title,
  tooltip,
  value,
  size = "sm",
}: CellarStatsProps) => {
  return (
    <Flex alignItems="center">
      <Heading
        size={size}
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        {isLoading ? <Spinner /> : value}
      </Heading>
      <CellarStatsLabel tooltip={tooltip} title={title} />
    </Flex>
  )
}

export const CellarStatsLabel = ({
  tooltip,
  title,
}: {
  tooltip?: string
  title: string
}) => {
  return (
    <Tooltip
      hasArrow
      placement="top"
      label={tooltip}
      bg="surface.bg"
      color="neutral.300"
    >
      <HStack spacing={1} align="center">
        <Label ml={1} color="neutral.300">
          {title}
        </Label>
        {tooltip && (
          <InformationIcon color="neutral.300" boxSize={3} />
        )}
      </HStack>
    </Tooltip>
  )
}
