import { FC } from "react"
import { HStack, Icon, Link, Spinner, Text } from "@chakra-ui/react"
import { FaExternalLinkAlt } from "react-icons/fa"

interface StrategyDashboardLinkProps {
  /** Dashboard URL from static cellar config. */
  href?: string
  /** Vault name from static cellar config. */
  name?: string
  isLoading: boolean
}

/**
 * The dashboard link previously gated on `strategyData`, which comes from the
 * strategy data API. When that API returns `data_pending`, useStrategyData's
 * `enabled` gate never opens, so the card sat on a literal "Loading..." string
 * forever. Both the href and the name come from static cellar config, so the
 * link does not need the API at all - only the loading state does.
 */
export const StrategyDashboardLink: FC<StrategyDashboardLinkProps> = ({
  href,
  name,
  isLoading,
}) => {
  if (isLoading) return <Spinner size="sm" />
  if (!href || !name) return <Text>--</Text>

  return (
    <HStack as={Link} href={href} target="_blank" rel="noreferrer">
      <Text as="span" fontWeight="bold" fontSize={21}>
        {name}
      </Text>
      <Icon as={FaExternalLinkAlt} color="purple.base" />
    </HStack>
  )
}
