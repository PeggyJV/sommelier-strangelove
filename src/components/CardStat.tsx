import { ReactNode, VFC } from "react"
import {
  Flex,
  HStack,
  StackProps,
  TextProps,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { CardHeading } from "./_typography/CardHeading"
import { InformationIcon } from "./_icons"

interface CardStatProps extends StackProps {
  label?: ReactNode
  labelProps?: TextProps
  tooltip?: ReactNode
  statIcon?: any
}

export const CardStat: VFC<CardStatProps> = ({
  label,
  labelProps,
  tooltip,
  statIcon,
  children,
  ...rest
}) => {
  return (
    <VStack
      flex={1}
      align="flex-start"
      whiteSpace="nowrap"
      spacing={0}
      {...rest}
    >
      <Tooltip
        hasArrow
        arrowShadowColor="purple.base"
        label={tooltip}
        placement="top"
        color="neutral.300"
        bg="surface.bg"
      >
        <HStack spacing={1} align="center">
          <CardHeading {...labelProps}>{label}</CardHeading>
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
          whiteSpace="break-spaces"
          fontSize="20px"
          fontWeight="bold"
        >
          {children}
        </Flex>
      </HStack>
    </VStack>
  )
}
