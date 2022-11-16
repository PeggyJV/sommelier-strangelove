import {
  Avatar,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { CellarDataMap } from "data/types"
import { VFC } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "./Link"
import { InformationIcon } from "./_icons"
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
      <HStack as={Link} href={href} isExternal>
        {logo && <Avatar src={logo} size="xs" />}
        <Text as="span" fontWeight="bold" fontSize={21}>
          {title}
        </Text>
        <Icon as={FaExternalLinkAlt} color="purple.base" />
      </HStack>
    </VStack>
  )
}
