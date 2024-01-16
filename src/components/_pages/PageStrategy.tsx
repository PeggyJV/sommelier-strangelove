import { Box, Link, Text } from "@chakra-ui/react"
import { HeroStrategy } from "components/HeroStrategy"
import { Highlight } from "components/Highlight"
import { ArrowLeftIcon } from "components/_icons"
import { Layout } from "components/_layout/Layout"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { CustomFaqSection, HomeWithImages } from "types/sanity"

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
        {/*<Cellars data={sectionCellars} mt={52} />*/}
        {/*<Strategy data={sectionStrategies} mt={52} />*/}
        {/*<FAQStrategy data={faqData} mt={52} />*/}
      </Box>
    </Layout>
  )
}
