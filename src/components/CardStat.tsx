import { VFC } from "react"
import {
  HStack,
  Icon,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CardHeading } from "./_typography/CardHeading"

interface CardStatProps extends StackProps {
  label: string
  labelIcon?: any
  statIcon?: any
}

export const CardStat: VFC<CardStatProps> = ({
  label,
  labelIcon,
  statIcon,
  children,
  ...rest
}) => {
  return (
    <VStack flex={1} align="flex-start" {...rest}>
      <CardHeading>
        {label}
        {labelIcon && (
          <>
            {" "}
            <Icon boxSize={3} />
          </>
        )}
      </CardHeading>
      <HStack spacing={1} align="center">
        {statIcon && (
          <Icon
            boxSize={5}
            color="text.body.dark"
            bg="white"
            p={1}
            borderRadius="50%"
            as={statIcon}
          />
        )}
        <Text whiteSpace="nowrap" fontSize="21px" fontWeight="bold">
          {children}
        </Text>
      </HStack>
    </VStack>
  )
}
