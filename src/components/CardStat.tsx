import { ReactNode, FC } from "react"
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
  statIcon?: unknown
}

export const CardStat: FC<CardStatProps> = ({
  label,
  labelProps,
  tooltip,
  statIcon: _statIcon,
  children,
  ...rest
}) => {
  return (
    <VStack
      flex={1}
      align="flex-start"
      minW={0}
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
      <HStack spacing={1} align="center" minW={0} w="full">
        <Flex
          align="center"
          fontSize="20px"
          fontWeight="bold"
          minW={0}
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace={{ base: "nowrap", md: "normal" }}
        >
          {children}
        </Flex>
      </HStack>
    </VStack>
  )
}
