import { PageStrategy } from "components/_pages/PageStrategy"
import { cellarDataMap } from "data/cellarDataMap"
import { strategyPageContentData } from "data/strategyPageContentData"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect } from "react"
import { sanityClient } from "src/lib/sanity/client"
import {
  sanityFaqQuery,
  sanityHomeQuery,
} from "src/lib/sanity/queries"
import { CustomFaqSection, HomeWithImages } from "types/sanity"

export interface StrategyLandingPageProps {
  id: string
  faqData: CustomFaqSection
  sectionCellars: HomeWithImages["sectionCellars"]
  sectionStrategies: HomeWithImages["sectionStrategies"]
}

export type Params = ParsedUrlQuery & { id: string }

const StrategyLandingPage: NextPage<StrategyLandingPageProps> = (
  props
) => {
  const router = useRouter()
  const landingPageContent = strategyPageContentData[props.id]
  useEffect(() => {
    if (!landingPageContent) {
      router.replace(`/strategies/${props.id}/manage`)
    }
  }, [router, landingPageContent, props.id])
  if (!landingPageContent) return null
  return <PageStrategy {...props} />
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const cellars = Object.keys(cellarDataMap)
  const paths = cellars.map((cellar) => {
    return { params: { id: cellar } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params || {}
  const faqData = await sanityClient.fetch(sanityFaqQuery)
  const home: HomeWithImages = await sanityClient.fetch(
    sanityHomeQuery
  )

  return {
    props: {
      id,
      faqData,
      sectionCellars: home.sectionCellars,
      sectionStrategies: home.sectionStrategies,
    },
  }
}

export default StrategyLandingPage
