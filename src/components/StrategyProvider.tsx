import {
  Avatar,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { CellarDataMap } from "data/types"
import React, { VFC } from "react"
import { Link } from "./Link"
import { ExternalLinkIcon, InformationIcon } from "./_icons"
import { CardHeading } from "./_typography/CardHeading"

export type StrategyProviderProps = Pick<
  CellarDataMap["key: string"],
  "strategyProvider"
>

export const StrategyProvider: VFC<StrategyProviderProps> = ({
  strategyProvider,
}) => {
  const { logo, title, href, tooltip } = strategyProvider || {}

  return (
    <VStack spacing={0} align="flex-start">
      {tooltip ? (
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label={tooltip}
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>Strategy Provider</CardHeading>
            <InformationIcon boxSize="12px" />
          </HStack>
        </Tooltip>
      ) : (
        <HStack spacing={1} align="center">
          <CardHeading>Strategy Provider</CardHeading>
          <InformationIcon boxSize="12px" />
        </HStack>
      )}
      <HStack>
        {logo && <Avatar src={logo} boxSize="16px" />}
        <Text as="span" fontWeight="bold" fontSize={21}>
          {title}
        </Text>
      </HStack>
      <Link
        href={href}
        isExternal
        _hover={{
          textDecoration: "underline",
        }}
      >
        <HStack role="group" align="center">
          <Text>Visit Website</Text>{" "}
          <ExternalLinkIcon
            color="purple.base"
            _groupHover={{
              color: "neutral.100",
            }}
          />
        </HStack>
      </Link>
    </VStack>
  )
}
