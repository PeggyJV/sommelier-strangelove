import {
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { VFC } from "react"

interface HeroStrategyLeftProps {
  id: string
}

export const HeroStrategyLeft: VFC<HeroStrategyLeftProps> = ({
  id,
}) => {
  const content = strategyPageContentData[id]
  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="4xl" fontWeight="900" as="h1">
          {content.name}
        </Heading>
        <Text fontWeight="semibold">
          by{" "}
          <Link
            textDecoration="underline"
            href={content.providerUrl}
            target="_blank"
          >
            {content.provider}
          </Link>
        </Text>
      </Stack>
      <Heading size="lg">{content.description}</Heading>
      <HStack spacing={{ base: 2, md: 8 }} pt={10}>
        <Image
          ml={-6}
          src="/assets/images/asset-management.png"
          alt="asset management image"
        />
        <Stack>
          <Text fontWeight="semibold" fontSize="xl">
            Automated Portfolio Optimization
          </Text>
          <Text>
            Deposit your tokens into the vault and let the vault and
            its automated rebalances optimize them across DeFi
            opportunities.
          </Text>
        </Stack>
      </HStack>
    </Stack>
  )
}
