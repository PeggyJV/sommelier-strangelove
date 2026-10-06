import { Box, Link, Text } from "@chakra-ui/react"
import { HeroStrategy } from "components/HeroStrategy"
import { Highlight } from "components/Highlight"
import { ArrowLeftIcon } from "components/_icons"
import { Layout } from "components/_layout/Layout"
import { NextPage } from "next"
import { WalletHealthBanner } from "components/_banners/WalletHealthBanner"

export interface StrategyLandingPageProps {
  id: string
}

export const PageStrategy: NextPage<StrategyLandingPageProps> = ({ id }) => {
  return (
    <Layout>
      <WalletHealthBanner />
      <Box px={{ base: 4, sm: 0 }}>
        <Link
          mb={4}
          color="neutral.300"
          href={`/strategies/${id}/manage`}
          display="flex"
          alignItems="center"
        >
          <ArrowLeftIcon />
          <Text ml={2}>Back</Text>
        </Link>
        <HeroStrategy id={id} />
        <Highlight id={id} />
      </Box>
    </Layout>
  )
}
