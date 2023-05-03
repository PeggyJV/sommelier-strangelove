import { Box, BoxProps, Grid, Heading } from "@chakra-ui/react"
import { Link } from "components/Link"
import { BecomeProvider } from "./BecomeProvider"
import Image from "next/image"
import { CardBase } from "components/_cards/CardBase"

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
              objectFit="scale-down"
            />
          </CardBase>
        </Link>
        <Link isExternal href="https://cleargate.capital/">
          <CardBase justifyContent="center" h="full">
            <Image
              width={243}
              height={100}
              alt="ClearGate"
              src="/assets/logos/clear-gate.webp"
              objectFit="scale-down"
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
              objectFit="scale-down"
            />
          </CardBase>
        </Link>
        <CardBase justifyContent="center" h="full" px={0}>
          <Image
            width={243}
            height={100}
            alt="Define Logic Labs"
            src="/assets/logos/define-logic-labs.webp"
            objectFit="scale-down"
          />
        </CardBase>
        <CardBase justifyContent="center" h="full" px={0}>
          <Image
            width={243}
            height={100}
            alt="Define Logic Labs"
            src="/assets/logos/algolab.webp"
            objectFit="scale-down"
          />
        </CardBase>
        <BecomeProvider />
      </Grid>
    </Box>
  )
}
