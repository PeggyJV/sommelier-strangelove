import { Box } from "@chakra-ui/react"
import { Cellars } from "components/Cellars"
import { FAQStrategy } from "components/FAQStrategy"
import { HeroStrategy } from "components/HeroStrategy"
import { Highlight } from "components/Highlight"
import { Layout } from "components/Layout"
import { Strategy } from "components/Strategy"
import { NextPage } from "next"
import { StrategyLandingPageProps } from "pages/strategies/[id]"

export const PageStrategy: NextPage<StrategyLandingPageProps> = ({
  id,
  faqData,
  sectionCellars,
  sectionStrategies,
}) => {
  return (
    <Layout>
      <Box px={{ base: 4, sm: 0 }}>
        <HeroStrategy id={id} />
        <Highlight id={id} />
        <Cellars data={sectionCellars} mt={52} />
        <Strategy data={sectionStrategies} mt={52} />
        <FAQStrategy data={faqData} mt={52} />
      </Box>
    </Layout>
  )
}
