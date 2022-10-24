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
          <Link textDecoration="underline" href={content.providerUrl}>
            {content.provider}
          </Link>
        </Text>
      </Stack>
      <Heading size="lg">{content.description}</Heading>
      <HStack spacing={8} pt={10}>
        <Image
          ml={-6}
          src="/assets/images/asset-management.png"
          alt="asset management image"
        />
        <Stack>
          <Text fontWeight="semibold" fontSize="xl">
            Automated Asset Management Included
          </Text>
          <Text>
            Buy the token to get exposure to the strategy portfolio,
            and sell it when you want to exit. Smart contract
            algorithms manage the rest.
          </Text>
        </Stack>
      </HStack>
    </Stack>
  )
}
