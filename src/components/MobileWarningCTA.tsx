import { Flex, FlexProps, Text, VStack } from "@chakra-ui/react"
import React, { FC } from "react"
import { Link } from "./Link"
import { LogoTextIcon } from "./_icons"

interface MobileWarningCTAProps extends FlexProps {
  text: string
}

export const MobileWarningCTA: FC<MobileWarningCTAProps> = ({
  text,
  ...props
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      minH="40vh"
      p={6}
      {...props}
    >
      <VStack
        flex={1}
        spacing={6}
        align="center"
        justify="center"
        fontSize={12}
      >
        <LogoTextIcon h={6} w="auto" />
        <Text textAlign="center">{text}</Text>
        <Link
          href="https://t.me/getsomm"
          fontWeight="bold"
          textDecoration="underline"
          isExternal
        >
          Join the conversation
        </Link>
        <Link
          href="https://www.sommelier.finance/"
          fontWeight="bold"
          textDecoration="underline"
        >
          Learn more
        </Link>
      </VStack>
    </Flex>
  )
}
