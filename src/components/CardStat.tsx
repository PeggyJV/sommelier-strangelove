import { ReactNode, VFC } from "react"
import {
  Flex,
  HStack,
  StackProps,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { CardHeading } from "./_typography/CardHeading"
import { InformationIcon } from "./_icons"

interface CardStatProps extends StackProps {
  label?: ReactNode
  tooltip?: ReactNode
  statIcon?: any
}

export const CardStat: VFC<CardStatProps> = ({
  label,
  tooltip,
  statIcon,
  children,
  ...rest
}) => {
  return (
    <VStack flex={1} align="flex-start" {...rest}>
      <Tooltip
        hasArrow
        arrowShadowColor="purple.base"
        label={tooltip}
        placement="top"
        bg="surface.bg"
      >
        <HStack align="center">
          <CardHeading>{label}</CardHeading>
          {tooltip && (
            <>
              {" "}
              <InformationIcon color="neutral.300" boxSize={3} />
            </>
          )}
        </HStack>
      </Tooltip>
      <HStack spacing={1} align="center">
        <Flex
          align="center"
          whiteSpace="nowrap"
          fontSize="21px"
          fontWeight="bold"
        >
          {children}
        </Flex>
      </HStack>
    </VStack>
  )
}
