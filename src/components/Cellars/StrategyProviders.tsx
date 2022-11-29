import { Box, BoxProps, Grid, Heading } from "@chakra-ui/react"
import { Link } from "components/Link"
import { SevenSeasIcon } from "components/_icons/SevenSeasIcon"
import { ClearGateIcon } from "components/_icons/ClearGateIcon"
import { BecomeProvider } from "./BecomeProvider"
import { CardBase } from "./CardBase"
import { PatacheIcon } from "components/_icons/PatacheIcon"

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
            <SevenSeasIcon w={{ base: 200, lg: 243 }} h={100} />
          </CardBase>
        </Link>
        <Link isExternal href="https://cleargate.capital/">
          <CardBase justifyContent="center" h="full">
            <ClearGateIcon w={{ base: 200, lg: 243 }} h={100} />
          </CardBase>
        </Link>
        <Link isExternal href="https://www.algoreturns.com/patache/">
          <CardBase justifyContent="center" h="full">
            <PatacheIcon w={{ base: 200, lg: 243 }} h={100} />
          </CardBase>
        </Link>
        <BecomeProvider />
      </Grid>
    </Box>
  )
}
