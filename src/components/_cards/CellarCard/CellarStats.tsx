import {
  Flex,
  Heading,
  HStack,
  Spinner,
  Tooltip,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import { ReactNode } from "react"
import { Label } from "./Label"

interface CellarStatsProps {
  isLoading?: boolean
  title: string
  tooltip?: string
  value: string
  size?: string
  colorValue?: string
}

export const CellarStats = ({
  isLoading,
  title,
  tooltip,
  value,
  size = "sm",
  colorValue,
}: CellarStatsProps) => {
  return (
    <Flex alignItems="center">
      <Heading
        size={size}
        display="flex"
        alignItems="center"
        columnGap="3px"
        color={colorValue}
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
  tooltip?: ReactNode
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
        {!!tooltip && (
          <InformationIcon color="neutral.300" boxSize={3} />
        )}
      </HStack>
    </Tooltip>
  )
}
