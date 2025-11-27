import { Box, Link, Text } from "@chakra-ui/react"
import { HeroStrategy } from "components/HeroStrategy"
import { Highlight } from "components/Highlight"
import { ArrowLeftIcon } from "components/_icons"
import { Layout } from "components/_layout/Layout"
import { ExecutionLogicOverview } from "components/_vaults/ExecutionLogicOverview"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { CustomFaqSection, HomeWithImages } from "types/sanity"
import { WalletHealthBanner } from "components/_banners/WalletHealthBanner"

export interface StrategyLandingPageProps {
  id: string
  faqData: CustomFaqSection
  sectionCellars: HomeWithImages["sectionCellars"]
  sectionStrategies: HomeWithImages["sectionStrategies"]
}

export const PageStrategy: NextPage<StrategyLandingPageProps> = ({
  id,
  faqData,
  sectionCellars,
  sectionStrategies,
}) => {
  const router = useRouter()
  return (
    <Layout>
      <WalletHealthBanner />
      <Box px={{ base: 4, sm: 0 }}>
        <Link
          mb={4}
          color="text.secondary"
          href={`/strategies/${id}/manage`}
          display="flex"
          alignItems="center"
          _hover={{ color: "text.primary" }}
          transition="color 0.15s ease"
        >
          <ArrowLeftIcon />
          <Text ml={2}>Back</Text>
        </Link>
        <HeroStrategy id={id} />
        <Highlight id={id} />

        {/* Execution Logic Overview - Vault Manager Role */}
        <ExecutionLogicOverview strategyName={id} />

        {/*<Cellars data={sectionCellars} mt={52} />*/}
        {/*<Strategy data={sectionStrategies} mt={52} />*/}
        {/*<FAQStrategy data={faqData} mt={52} />*/}
      </Box>
    </Layout>
  )
}
