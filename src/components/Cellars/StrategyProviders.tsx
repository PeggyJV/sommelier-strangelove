import { Box, BoxProps, Grid, Heading } from "@chakra-ui/react"
import { Link } from "components/Link"
import { BecomeProvider } from "./BecomeProvider"
import { CardBase } from "./CardBase"
import Image from "next/image"

export const StrategyProviders: React.FC<BoxProps> = (props) => {
  return (
    <Box position="relative" zIndex="2" w="full" {...props}>
      <Heading as="h3" size="sm" mb={10}>
        Strategy Providers
      </Heading>
      <Grid
        gap={6}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          xl: "repeat(3, 1fr)",
        }}
      >
        <Link isExternal href="https://7seas.capital/">
          <CardBase justifyContent="center" h="full">
            <Image
              width={243}
              height={100}
              alt="seven seas"
              src="/assets/logos/seven-seas.webp"
            />
          </CardBase>
        </Link>
        <Link isExternal href="https://cleargate.capital/">
          <CardBase justifyContent="center" h="full">
            <Image
              width={243}
              height={100}
              alt="clear gate"
              src="/assets/logos/clear-gate.webp"
            />
          </CardBase>
        </Link>
        <Link isExternal href="https://www.algoreturns.com/patache/">
          <CardBase justifyContent="center" h="full">
            <Image
              width={243}
              height={100}
              alt="patache"
              src="/assets/logos/patache.webp"
            />
          </CardBase>
        </Link>
        <BecomeProvider />
      </Grid>
    </Box>
  )
}
